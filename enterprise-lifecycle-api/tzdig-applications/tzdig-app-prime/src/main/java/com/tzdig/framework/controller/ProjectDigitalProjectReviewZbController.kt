package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaCheckRole
import cn.dev33.satoken.annotation.SaMode
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.model.dto.ProjectDigitalProjectReviewAllDTO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting.ProjectProgress
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
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

@Tag(name = "专班审核表管理")
@RestController
@RequestMapping("project-digital-project-review-zb")
class ProjectDigitalProjectReviewZbController(
    private val projectReviewService: ProjectReviewService,
    private val userService: UserService,
    private val projectDigitalProjectReviewService: ProjectDigitalProjectReviewService,
) {

    @Operation(summary = "判断用户是否需要填报")
    @GetMapping("check")
    fun check(
        @RequestParam zsId: String,
    ): SimpleValueDTO<Boolean> {
        if (!userAccount.hasRole(SystemRole.PROJECT_REVIEW_ZB))
            return SimpleValueDTO(false)
        val cnt = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq zsId)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB)
        }
        return SimpleValueDTO(cnt != 0L)
    }

    @Transactional
    @Operation(summary = "修改专班审核表")
    @SaCheckRole(SystemRole.PROJECT_REVIEW_ZB)
    @PutMapping
    fun updateProjectDigitalProjectReviewZb(
        @RequestBody dto: ProjectDigitalProjectReviewAllDTO,
    ): SimpleValueDTO<Boolean> {
        val record = queryOne<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB)
            orderBy(ProjectDigitalProjectReviewAll::batch).desc()
            limit(1)
        } ?: throw NotFoundException("专班审核表不存在")
        val userCob = userService.getCobsByUserid(userAccount.id!!).first()
        record.cobId = userCob
        record.result = dto.result
        record.comment = dto.comment
        record.name = userAccount.realName
        record.status = "已完成"
        record.deptName =
            userService.getUserOrganizationById(userAccount.organizationIds.first())?.name
                ?: ""
        record.updateById()
        projectDigitalProjectReviewService.updateTaskStatus(record.id!!)
        val investment = queryOneById<ProjectDigitalInvestmentAttracting>(dto.digitalInvestmentId)
        record.result == "1"
        when (record.result) {
            "0" -> {
                //审核退回
                investment?.auditStatus = 6
                investment?.updateById()
                projectDigitalProjectReviewService.sendReviewSms(investment?.id!!)
            }

            "1" -> {
                // 审核通过并计分
                investment?.currentProjectProgress = ProjectProgress.SIGNING
                investment?.isProjectReviewComplete = true
                investment?.auditStatus = 5
                investment?.updateById()
                projectDigitalProjectReviewService.sendReviewSms(investment?.id!!)
                projectDigitalProjectReviewService.projectScore(record)
            }

            "2" -> {
                investment?.auditStatus = 7
                investment?.updateById()
            }

            "3" -> {
                investment?.auditStatus = 8
                investment?.updateById()
            }
        }
//        projectReviewService.checkCallBack(investment!!.investOnlineId!!, result, userCob, dto.comment)
        return SimpleValueDTO(true)
    }

    @Operation(summary = "申请签约核定专班审核")
    @SaCheckRole(SystemRole.MY_PROJECT, SystemRole.DEPARTMENT_PROJECT, mode = SaMode.OR)
    @PostMapping("apply-zb/{id}")
    fun applyZb(
        @PathVariable id: String,
    ) {
        val investment = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::id eq id)
        }
        if (investment != null) {
            if (investment.auditStatus == 6) {
                investment.auditStatus = 4
                val reviewZbId = projectReviewService.createZbReview(investment.id!!)
                if (reviewZbId != null) projectDigitalProjectReviewService.createTask(listOf(reviewZbId))
            }
            investment.updateById()
        }
    }

//    @Transactional
//    @Operation(summary = "修改开工专班审核表")
//    @SaCheckRole(SystemRole.PROJECT_REVIEW_ZB)
//    @PutMapping("zb")
//    fun updateProjectDigitalProjectStartReview(
//        @RequestBody dto: ProjectDigitalProjectReviewAllDTO,
//    ): SimpleValueDTO<Boolean> {
//        val record = queryOne<ProjectDigitalProjectReviewAll> {
//            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
//            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW_ZB)
//            orderBy(ProjectDigitalProjectReviewAll::batch).desc()
//            limit(1)
//        } ?: throw NotFoundException("开工专班审核表不存在")
//        val userCob = userService.getCobsByUserid(userAccount.id!!).first()
//        record.cobId = userCob
//        record.result = dto.result
//        record.comment = dto.comment
//        record.name = userAccount.realName
//        record.status = "已完成"
//        record.deptName =
//            userService.getUserOrganizationById(userAccount.organizationIds.first())?.name
//                ?: ""
//        record.updateById()
//        projectDigitalProjectReviewService.updateTaskStatus(record.id!!)
//        val investment = queryOneById<ProjectDigitalInvestmentAttracting>(dto.digitalInvestmentId)
//        val result = record.result == "1"
//        if (result) {
//            // 审核通过并计分
//            investment?.currentProjectProgress = ProjectProgress.START
//            investment?.auditStatusKaigong = 5
//            investment?.updateById()
//            projectReviewService.callBack(investment?.investOnlineId!!, true, record.cobId, record.comment)
//            projectDigitalProjectReviewService.projectScore(record)
//        } else {
//            //审核退回
//            investment?.auditStatusKaigong = 6
//            investment?.updateById()
//            projectDigitalProjectReviewService.sendReviewSms(investment?.id!!)
//        }
////        projectReviewService.checkCallBack(investment!!.investOnlineId!!, result, userCob, dto.comment)
//        return SimpleValueDTO(true)
//    }

//    @Operation(summary = "申请开工认定专班审核")
//    @SaCheckRole(SystemRole.MY_PROJECT)
//    @PostMapping("apply-zb-start/{id}")
//    fun applyZbStart(
//        @PathVariable id: String,
//    ) {
//        val investment = queryOneById<ProjectDigitalInvestmentAttracting>(id)
//        if (investment != null) {
//            if (investment.auditStatusKaigong == 6) {
//                investment.auditStatusKaigong = 4
//                val reviewZbId = projectReviewService.createStartZbReview(investment.id!!)
//                if (reviewZbId != null) projectDigitalProjectReviewService.createTask(listOf(reviewZbId))
//            }
//            investment.updateById()
//        }
//    }
}
