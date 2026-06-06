package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaCheckRole
import cn.dev33.satoken.annotation.SaMode
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.DeptConstant
import com.tzdig.framework.core.constant.DeptConstant.FAGAI_CODE
import com.tzdig.framework.core.constant.DeptConstant.FAGAI_LIST
import com.tzdig.framework.core.constant.DeptConstant.GONGXIN_LIST
import com.tzdig.framework.core.constant.DeptConstant.TAIZHOU_FAGAI_NAME
import com.tzdig.framework.core.constant.DeptConstant.allCountyCodes
import com.tzdig.framework.core.constant.DeptConstant.codeToNameMap
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.model.dto.ProjectDigitalProjectReviewAllDTO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.security.extension.hasAnyRole
import com.tzdig.framework.security.extension.hasRole
import com.tzdig.framework.security.extension.organizationIds
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.service.ProjectDigitalProjectReviewService
import com.tzdig.framework.service.ProjectReviewService
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

@Tag(name = "招商项目市级审核表管理")
@RestController
@RequestMapping("project-digital-project-review")
class ProjectDigitalProjectReviewController(
    private val userService: UserService,
    private val projectDigitalProjectReviewService: ProjectDigitalProjectReviewService,
    private val projectReviewService: ProjectReviewService,
    ) {

    @Operation(summary = "判断用户是否需要填报")
    @GetMapping("check")
    fun check(
        @RequestParam zsId: String,
    ): SimpleValueDTO<Boolean> {
        if (!userAccount.hasRole(SystemRole.PROJECT_REVIEW_DEPT))
            return SimpleValueDTO(false)
        val cob = userService.getCobsByUserid(userAccount.id!!)
        val cnt = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq zsId)
            and(ProjectDigitalProjectReviewAll::cobId eq cob.first())
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
        }
        return SimpleValueDTO(cnt != 0L)
    }

    @Operation(summary = "判断用户是否需要上传材料")
    @GetMapping("check-file")
    fun checkFile(
        @RequestParam zsId: String,
    ): SimpleValueDTO<Boolean> {
        if (!userAccount.hasAnyRole(SystemRole.MY_PROJECT, SystemRole.DEPARTMENT_PROJECT))
            return SimpleValueDTO(false)
        val investment = queryOneById<ProjectDigitalInvestmentAttracting>(zsId)
        return SimpleValueDTO(investment?.auditStatus == 3 || investment?.auditStatus == 6)
    }

    @Operation(summary = "判断用户是否申请签约核定")
    @GetMapping("check-request")
    fun checkRequest(
        @RequestParam zsId: String,
    ): SimpleValueDTO<String> {
        if (!userAccount.hasAnyRole(SystemRole.MY_PROJECT, SystemRole.DEPARTMENT_PROJECT))
            return SimpleValueDTO("用户无权限")
        val investment = queryOneById<ProjectDigitalInvestmentAttracting>(zsId)
        if (investment?.auditStatus == 3) {
            return SimpleValueDTO("部门审核申请")
        } else if (investment?.auditStatus == 6) {
            return SimpleValueDTO("专班审核申请")
        }
        return SimpleValueDTO("无需申请")
    }

    @Operation(summary = "查询用户委办局/部门")
    @GetMapping("cob")
    fun getProjectDigitalProjectReviewCob(): String? {
        val cob = userService.getCobsByUserid(userAccount.id!!)
        return DeptConstant.DEPARTMENT_LIST.find { it.first == cob.first() }?.second
            ?: FAGAI_LIST.find { it.first.first == cob.first() }?.second
            ?: GONGXIN_LIST.find { it.first.first == cob.first() }?.second
    }

    @Transactional
    @Operation(summary = "修改招商项目市级审核表")
    @SaCheckRole(SystemRole.PROJECT_REVIEW_DEPT)
    @PutMapping("{id}")
    fun updateProjectDigitalProjectReview(
        @PathVariable id: String,
        @RequestBody dto: ProjectDigitalProjectReviewAllDTO
    ): SimpleValueDTO<Boolean> {
        val userCob = userService.getCobsByUserid(userAccount.id!!).first()
        val record = queryOne<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
            and(ProjectDigitalProjectReviewAll::cobId eq userCob)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
            orderBy(ProjectDigitalProjectReviewAll::batch).desc()
            limit(1)
        } ?: throw NotFoundException("招商项目市级审核表不存在")
        dto.into(record)
        record.status = "已完成"
        record.deptName =
            userService.getUserOrganizationById(userAccount.organizationIds.first())
                ?.name
                ?: ""
        record.name = userAccount.realName
        record.updateById()
        projectDigitalProjectReviewService.updateTaskStatus(record.id!!)
        // 校验部门全部完成且结果为通过
        val cnt1 = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
        }
        val cnt2 = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
            and(ProjectDigitalProjectReviewAll::status eq "已完成")
            and(ProjectDigitalProjectReviewAll::result eq "0")
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
        }
        val investment = queryOneById<ProjectDigitalInvestmentAttracting>(dto.digitalInvestmentId)

        if (cnt1 == 0L && cnt2 == 0L) {
            //部门审核全部通过
            investment?.auditStatus = 4
            investment?.updateById()
            val reviewZbId = projectReviewService.createZbReview(investment?.id!!)
            if (reviewZbId != null) projectDigitalProjectReviewService.createTask(listOf(reviewZbId))
            projectDigitalProjectReviewService.sendReviewSms(investment.id!!)
        } else if (cnt2 != 0L) {
            //部门审核退回
            investment?.auditStatus = 3
            investment?.updateById()
            projectDigitalProjectReviewService.sendReviewSms(investment?.id!!)
//            projectReviewService.checkCallBack(investment!!.investOnlineId!!, false, userCob, dto.comment)
        }
        return SimpleValueDTO(true)
    }


    @Operation(summary = "申请签约核定部门审核")
    @SaCheckRole(SystemRole.MY_PROJECT, SystemRole.DEPARTMENT_PROJECT, mode = SaMode.OR)
    @PostMapping("apply/{id}")
    fun applyZb(
        @PathVariable id: String,
    ) {
        val investment = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::investOnlineId eq id)
        }
        if (investment != null) {
            if (investment.auditStatus == 3) {
                investment.auditStatus = 1
            }
            investment.updateById()
            val record = query<ProjectDigitalProjectReviewAll> {
                where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq id)
                and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW)
            }.mapNotNull { it.batch }.maxOrNull()
            val list = mutableListOf<String>()
            if (investment.projectType == "服务业") {
                list.add(
                    createReview(
                        FAGAI_CODE,
                        investment.id!!,
                        ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW,
                        record ?: 0
                    )
                )
            } else if (investment.projectType == "工业") {
                list.add(
                    createReview(
                        DeptConstant.GONGXIN_CODE,
                        investment.id!!,
                        ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW,
                        record ?: 0
                    )
                )
            }
            if (investment.isKcProj == "是") {
                list.add(
                    createReview(
                        DeptConstant.KEJI_CODE,
                        investment.id!!,
                        ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW,
                        record ?: 0
                    )
                )
            }
            if (investment.investmentFlag?.toInt() == 2) {
                list.add(
                    createReview(
                        DeptConstant.SHANGWU_CODE,
                        investment.id!!,
                        ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW,
                        record ?: 0
                    )
                )
            }

            projectDigitalProjectReviewService.createTask(list)

        }
    }

    @Operation(summary = "开工项目发改流转")
    @SaCheckRole(SystemRole.PROJECT_REVIEW_START)
    @PostMapping("start-send/{id}/{dept}")
    fun start(
        @PathVariable id: String,
        @PathVariable dept: String,
    ) {
        val record = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq id)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
        }.firstOrNull()
        if (record == null) return
        val cobId = FAGAI_LIST.find { it.second == dept }?.first?.first
        record.cobId = cobId
        record.updateById()
    }

    @Operation(summary = "查看开工项目发改流转项目")
    @GetMapping("start-send/{id}")
    fun startSendDept(
        @PathVariable id: String
    ): List<String> {
        val record = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq id)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
        }.firstOrNull()
        val investment = queryOneById<ProjectDigitalInvestmentAttracting>(id)
        if (investment == null || investment.projectType == "服务业") throw NotFoundException("未找到对应的部门")
        val userCobs = userService.getCobsByUserid(userAccount.id!!)
        return if (record != null) {
            when {
                record.cobId == FAGAI_CODE -> {
                    if (userAccount.hasRole(SystemRole.PROJECT_REVIEW_START) && userCobs.contains(FAGAI_CODE)) {// 传入的是“发改 code”，返回所有区县 name
                        allCountyCodes.map { codeToNameMap[it]!! }
                    } else {
                        throw NotFoundException("未找到对应的部门")
                    }
                }
                record.cobId in allCountyCodes -> {
                    if (userAccount.hasRole(SystemRole.PROJECT_REVIEW_START) && allCountyCodes.contains(userCobs.first())) {
                        // 传入的是某个区县 code，返回“发改 name”
                        listOf(TAIZHOU_FAGAI_NAME)
                    } else {
                        throw NotFoundException("未找到对应的部门")
                    }
                }

                else -> {
                    throw NotFoundException("未找到对应的部门")
                }
            }
        } else {
            throw NotFoundException("未找到对应的项目")
        }
    }


    @Operation(summary = "申请开工认定部门审核")
    @SaCheckRole(SystemRole.MY_PROJECT, SystemRole.DEPARTMENT_PROJECT, mode = SaMode.OR)
    @PostMapping("applyKg/{id}")
    fun applyDept(
        @PathVariable id: String,
    ) {
        val investment = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::investOnlineId eq id)
        }
        if (investment != null) {
            if (investment.auditStatusKaigong == 3) {
                investment.auditStatusKaigong = 1
            }
            val record = query<ProjectDigitalProjectReviewAll> {
                where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq id)
                and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
            }.mapNotNull { it.batch }.maxOrNull()
            val list = mutableListOf<String>()
            list.add(
                createReview(
                    //演示临时注掉
                    FAGAI_CODE,
                    investment.id!!,
                    ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
                    record ?: 0
                )
            )
            if (investment.isKcProj == "是") {
                list.add(
                    createReview(
                        DeptConstant.KEJI_CODE,
                        investment.id!!,
                        ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
                        record ?: 0
                    )
                )
            }
            if (investment.isQflp == "是") {
                list.add(
                    createReview(
                        DeptConstant.SHANGWU_CODE,
                        investment.id!!,
                        ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
                        record ?: 0
                    )
                )
            }
            projectDigitalProjectReviewService.createTask(list)
        }
    }

    fun createReview(
        deptCode: String?,
        digitalInvestmentId: String,
        step: ProjectDigitalProjectReviewAll.Step,
        batch: Int,
    ): String {
        val ProjectDigitalProjectReviewAll = ProjectDigitalProjectReviewAll()
        ProjectDigitalProjectReviewAll.step = step
        ProjectDigitalProjectReviewAll.digitalInvestmentId = digitalInvestmentId
        ProjectDigitalProjectReviewAll.cobId = deptCode
        ProjectDigitalProjectReviewAll.status = "未完成"
        ProjectDigitalProjectReviewAll.batch = batch
        ProjectDigitalProjectReviewAll.save()
        return ProjectDigitalProjectReviewAll.id!!
    }
    //auth：wangjin 阚泽阳代码写的很好，下次不要再写了！！！
}
