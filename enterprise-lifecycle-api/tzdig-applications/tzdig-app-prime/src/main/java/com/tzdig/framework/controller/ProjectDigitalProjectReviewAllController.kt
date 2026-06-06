package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.between
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.core.constant.DeptConstant
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.model.dto.ProjectDigitalProjectReviewAllDTO
import com.tzdig.framework.model.vo.ProjectDigitalProjectReviewAllVO
import com.tzdig.framework.model.vo.ProjectInfoStatVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting.ProjectProgress
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.entity.prime.ProjectNonInvestmentConfirmation
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.extension.hasAnyRole
import com.tzdig.framework.security.extension.hasRole
import com.tzdig.framework.security.extension.organizationIds
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.service.ProjectDigitalProjectReviewService
import com.tzdig.framework.service.ProjectReviewService
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import java.time.LocalDateTime

@Tag(name = "招商项目审核表管理")
@RestController
@RequestMapping("project-digital-project-review-all")
class ProjectDigitalProjectReviewAllController(
    private val userService: UserService,
    private val projectReviewService: ProjectReviewService,
    private val projectDigitalProjectReviewService: ProjectDigitalProjectReviewService,
) {
    @Operation(summary = "查询招商项目审核表列表")
    //@SaCheckPermission("project-digital-project-review-all::query")
    @GetMapping
    @PageableQuery
    fun listProjectDigitalProjectReviewAll(
        pageable: Pageable,
        @RequestParam zsId: String,
        @RequestParam step: String
    ): PageableResult<ProjectDigitalProjectReviewAllVO> {
        val page = paginate<ProjectDigitalProjectReviewAll>(pageable.pageNumber, pageable.pageSize) {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq zsId)
            val step = ProjectDigitalProjectReviewAll.Step.entries.find { it.value == step }
            if (step != null) and(ProjectDigitalProjectReviewAll::step eq step)
            orderBy(ProjectDigitalProjectReviewAll::batch).asc()
        }.map(::ProjectDigitalProjectReviewAllVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询招商项目审核表")
    //@SaCheckPermission("project-digital-project-review-all::query")
    @GetMapping("{id}")
    fun getProjectDigitalProjectReviewAll(
        @PathVariable id: String,
    ): ProjectDigitalProjectReviewAllVO {
        val record = queryOneById<ProjectDigitalProjectReviewAll>(id)
            ?: throw NotFoundException("招商项目审核表不存在")
        return ProjectDigitalProjectReviewAllVO(record)
    }

    @Operation(summary = "创建记分流水")
    //@SaCheckPermission("project-digital-service::create")
    @PostMapping
    fun createProjectDigitalService(
        @RequestBody dto: ProjectDigitalProjectReviewAllDTO,
    ) {
        dto.result = "1"
        dto.step = ProjectDigitalProjectReviewAll.Step.ADDITIONAL_SCORE
        val record = dto.toProjectDigitalProjectReviewAll()
        if (dto.year != null) {
            val year = dto.year
            val createTime = LocalDateTime.of(year!!, 1, 1, 0, 0, 0)
            record.createTime = createTime
        }
        record.save()

    }

    @Transactional
    @Operation(summary = "修改招商项目开工审核")
//    @SaCheckRole(SystemRole.PROJECT_REVIEW_START)
    @PutMapping("start-approval")
    fun updateProjectDigitalStartApproval(
        @RequestBody dto: ProjectDigitalProjectReviewAllDTO,
    ): SimpleValueDTO<Boolean> {
        val dept = userService.getCobsByUserid(userAccount.id!!).firstOrNull() ?: throw NotFoundException("部门不存在")
        val record = queryOne<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
            and(ProjectDigitalProjectReviewAll::cobId eq dept)
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
        record.step = ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW
        record.updateById()
        val investment = queryOneById<ProjectDigitalInvestmentAttracting>(dto.digitalInvestmentId)
        // 校验部门全部完成且结果为通过
        val cnt1 = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
            and(ProjectDigitalProjectReviewAll::batch eq record.batch)
        }
        // 校验部门不通过数量
        val cnt2 = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
            and(ProjectDigitalProjectReviewAll::status eq "已完成")
            and(ProjectDigitalProjectReviewAll::result eq "0")
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
            and(ProjectDigitalProjectReviewAll::batch eq record.batch)
        }
        if (cnt1 == 0L && cnt2 == 0L) {
            if (investment?.isKcProj == "是" || investment?.projectType == "工业" || investment?.source == "增资扩产") {
                review(investment, record)
            } else if (investment?.projectType == "服务业") {
                //若为服务业项目，需要判断最新一个批次中是否只有发改审批节点
                if (queryCount<ProjectDigitalProjectReviewAll> {
                        where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
                        and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
                        and(ProjectDigitalProjectReviewAll::batch eq record.batch)
                    } == 1L) {
                    //只有服务业的情况下，生成部门节点
                    val list = mutableListOf<String>()
                    if (investment.isQflp == "是") {
                        list.add(
                            createReview(
                                DeptConstant.SHANGWU_CODE,
                                investment.id!!,
                                ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
                                record.batch ?: 0
                            )
                        )
                    }
//                    //项目大于1亿时生成市发改审批节点
//                    if (investment.investmentAmount!! >= 1.0 && investment.investmentFlag == "1" || investment.investmentFlag == "2" && investment.investmentAmount!! * 7 >= 1.0) {
//                        list.add(
//                            createReview(
//                                DeptConstant.FAGAI_CODE,
//                                investment.id!!,
//                                ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW,
//                                record.batch ?: 0
//                            )
//                        )
//                    }
                    if (list.isEmpty()) {
                        //无需创建审核，直接进行进行计分
                        review(investment, record)
                    } else {
                        projectDigitalProjectReviewService.createTask(list)
                    }
                } else {
                    //部门审核全部通过
                    review(investment, record)
                }
            }
        } else if (cnt2 != 0L && record.result != "1") {
            //部门审核退回
            val records = query<ProjectDigitalProjectReviewAll> {
                where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
                and(ProjectDigitalProjectReviewAll::status eq "未完成")
                and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
                and(ProjectDigitalProjectReviewAll::batch eq (record.batch?.plus(1) ?: 1))
            }
            records.forEach {
                it.status = "已完成"
                it.result = "0"
                it.comment = "部门审核退回"
                it.updateById()
            }
            investment?.auditStatusKaigong = 3
            investment?.updateById()
            projectDigitalProjectReviewService.sendReviewSms(investment?.id!!)
            projectReviewService.callBack(investment.investOnlineId!!, false, record.cobId, record.comment)
        }
        return SimpleValueDTO(true)
    }

    @Transactional
    @Operation(summary = "修改招商项目竣工审核")
//    @SaCheckRole(SystemRole.PROJECT_REVIEW_COMPLETION)
    @PutMapping("completion-approval")
    fun updateProjectDigitalCompletionApproval(
        @RequestBody dto: ProjectDigitalProjectReviewAllDTO,
    ): SimpleValueDTO<Boolean> {
        val record = queryOne<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
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
        val investment = queryOneById<ProjectDigitalInvestmentAttracting>(dto.digitalInvestmentId)
        if (dto.result == "1") {
            investment!!.currentProjectProgress = ProjectProgress.COMPLETION
            investment.updateById()
            if (investment.source == "增资扩产") {
                val list = queryOne<ProjectNonInvestmentConfirmation> {
                    and(ProjectNonInvestmentConfirmation::id eq investment.investOnlineId)
                }
                if (list != null) {
                    list.progress = ProjectProgress.COMPLETION
                    list.updateById()
                }
            }
        }
        projectReviewService.callBack(investment!!.investOnlineId!!, record.result == "1", record.cobId, record.comment)
        return SimpleValueDTO(true)
    }

    @Operation(summary = "删除招商项目审核表")
    //@SaCheckPermission("project-digital-project-review-all::delete")
    @DeleteMapping("{id}")
    fun deleteProjectDigitalProjectReviewAll(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectDigitalProjectReviewAll>(id)
        if (result == 0) throw NotFoundException("招商项目审核表不存在")
    }

    @Operation(summary = "判断用户是否需要填报开工认定部门审核")
    @GetMapping("check-start")
    fun checkStart(
        @RequestParam zsId: String,
    ): SimpleValueDTO<Boolean> {
        if (!userAccount.hasRole(SystemRole.PROJECT_REVIEW_START))
            return SimpleValueDTO(false)
        val cob = userService.getCobsByUserid(userAccount.id!!)
        val cnt = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq zsId)
            and(ProjectDigitalProjectReviewAll::cobId eq cob.first())
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW)
        }
        return SimpleValueDTO(cnt != 0L)
    }

//    @Operation(summary = "判断专班用户是否需要审核")
//    @GetMapping("check-start-zb")
//    fun checkStartZb(
//        @RequestParam zsId: String,
//    ): SimpleValueDTO<Boolean> {
//        if (!userAccount.hasRole(SystemRole.PROJECT_REVIEW_ZB))
//            return SimpleValueDTO(false)
//        val cnt = queryCount<ProjectDigitalProjectReviewAll> {
//            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq zsId)
//            and(ProjectDigitalProjectReviewAll::status eq "未完成")
//            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW_ZB)
//        }
//        return SimpleValueDTO(cnt != 0L)
//    }


    @Operation(summary = "判断用户是否需要填报竣工认定")
    @GetMapping("check-completion")
    fun checkCompletion(
        @RequestParam zsId: String,
    ): SimpleValueDTO<Boolean> {
        if (!userAccount.hasRole(SystemRole.PROJECT_REVIEW_COMPLETION))
            return SimpleValueDTO(false)
        val cob = userService.getCobsByUserid(userAccount.id!!)
        val cnt = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq zsId)
            and(ProjectDigitalProjectReviewAll::cobId eq cob.first())
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW)
        }
        return SimpleValueDTO(cnt != 0L)
    }

    @Operation(summary = "判断用户是否需要上传开工佐证材料")
    @GetMapping("check-file")
    fun checkFile(
        @RequestParam zsId: String,
    ): SimpleValueDTO<Boolean> {
        if (!userAccount.hasAnyRole(SystemRole.MY_PROJECT, SystemRole.DEPARTMENT_PROJECT))
            return SimpleValueDTO(false)
        val investment = queryOneById<ProjectDigitalInvestmentAttracting>(zsId)
        return SimpleValueDTO(investment?.auditStatusKaigong == 3 || investment?.auditStatusKaigong == 6)
    }

    @Operation(summary = "判断用户是否重新申请开工认定")
    @GetMapping("check-request")
    fun checkRequest(
        @RequestParam zsId: String,
    ): SimpleValueDTO<String> {
        if (!userAccount.hasAnyRole(SystemRole.MY_PROJECT, SystemRole.DEPARTMENT_PROJECT))
            return SimpleValueDTO("用户无权限")
        val investment = queryOneById<ProjectDigitalInvestmentAttracting>(zsId)
        if (investment?.auditStatusKaigong == 3) {
            return SimpleValueDTO("部门审核申请")
        } else if (investment?.auditStatusKaigong == 6) {
            return SimpleValueDTO("专班审核申请")
        }
        return SimpleValueDTO("无需申请")
    }


    //    @Operation(summary = "重置项目专班审核")
//    //@SaCheckPermission("project-digital-service::create")
//    @PostMapping()
//    fun createProjectDigitalService(
//
//    ) {
//
//    }
    @Operation(summary = "用户部门预评估统计")
    @GetMapping("quality-statistics-1")
    fun qualityStatistics(
        @Schema(description = "年")
        @RequestParam year: Int?,
        @Schema(description = "产业：工业/服务业")
        @RequestParam(defaultValue = "") industry: String,
    ): ProjectInfoStatVO {
        val list = query<ProjectDigitalInvestmentAttracting> {
            if (year != null) {
                where(
                    ProjectDigitalInvestmentAttracting::signingTime between LocalDate.of(year, 1, 1)..LocalDate.of(
                        year,
                        12,
                        31
                    )
                )
            }
            if (industry.isNotEmpty()) {
                and(ProjectDigitalInvestmentAttracting::projectType eq industry)
            }
            and(ProjectDigitalInvestmentAttracting::isQualityEvaluation eq true)
        }.mapNotNull { it.id }
        return ProjectInfoStatVO(
            totalCount = queryCount<ProjectDigitalProjectReviewAll> {
                where(ProjectDigitalProjectReviewAll::step eq "1")
                and(ProjectDigitalProjectReviewAll::digitalInvestmentId inList list)
            },
            unfinishedCount = queryCount<ProjectDigitalProjectReviewAll> {
                where(ProjectDigitalProjectReviewAll::step eq "1")
                and(ProjectDigitalProjectReviewAll::status eq "未完成")
                and(ProjectDigitalProjectReviewAll::digitalInvestmentId inList list)
            },
            finishedCount = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::step eq "1")
                and(ProjectDigitalProjectReviewAll::status eq "已完成")
                and(ProjectDigitalProjectReviewAll::digitalInvestmentId inList list)
            },
        )
    }



    fun review(
        investment: ProjectDigitalInvestmentAttracting,
        record: ProjectDigitalProjectReviewAll,
    ) {
        investment.auditStatusKaigong = 2
        investment.currentProjectProgress = ProjectProgress.START
        investment.updateById()
        if (investment.source == "自行接洽") {
            //若为自行接洽项目，流程结束不计分
            projectReviewService.callBack(
                investment.investOnlineId!!,
                true,
                record.cobId,
                record.comment
            )
        } else if (investment.source == "市级机关推荐") {
            projectReviewService.callBack(
                investment.investOnlineId!!,
                true,
                record.cobId,
                record.comment
            )
            projectDigitalProjectReviewService.projectScore(record)
        } else if (investment.source == "增资扩产") {
            val list = queryOne<ProjectNonInvestmentConfirmation> {
                and(ProjectNonInvestmentConfirmation::id eq investment.investOnlineId)
            }
            if (list != null) {
                list.progress = ProjectProgress.START
                list.updateById()
            }
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
}
