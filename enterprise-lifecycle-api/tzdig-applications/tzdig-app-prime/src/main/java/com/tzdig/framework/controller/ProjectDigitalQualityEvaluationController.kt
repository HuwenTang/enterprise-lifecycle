package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaCheckRole
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.model.dto.ProjectDigitalProjectReviewAllDTO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.security.extension.hasRole
import com.tzdig.framework.security.extension.organizationIds
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.service.ProjectDigitalProjectReviewService
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@Tag(name = "项目质态评估表管理")
@RestController
@RequestMapping("project-digital-quality-evaluation")
class ProjectDigitalQualityEvaluationController(
    private val userService: UserService,
    private val projectDigitalProjectReviewService: ProjectDigitalProjectReviewService,
) {

    @Operation(summary = "判断用户是否需要填报")
    @GetMapping("check")
    fun check(
        @RequestParam zsId: String,
    ): SimpleValueDTO<Boolean> {
        if (!userAccount.hasRole(SystemRole.QUALITY_EVALUATION))
            return SimpleValueDTO(false)
        val cob = userService.getCobsByUserid(userAccount.id!!)
        val cnt = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq zsId)
            and(ProjectDigitalProjectReviewAll::cobId eq cob.first())
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
        }
        return SimpleValueDTO(cnt != 0L)
    }

    @Operation(summary = "修改项目质态评估表")
    @SaCheckRole(SystemRole.QUALITY_EVALUATION)
    @PutMapping()
    fun updateProjectDigitalQualityEvaluation(
        @RequestBody dto: ProjectDigitalProjectReviewAllDTO,
    ): SimpleValueDTO<Boolean> {
        val userCob = userService.getCobsByUserid(userAccount.id!!).first()
        val record = queryOne<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
            and(ProjectDigitalProjectReviewAll::cobId eq userCob)
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION)
            orderBy(ProjectDigitalProjectReviewAll::batch).desc()
            limit(1)
        } ?: throw NotFoundException("项目质态评估表不存在")
        dto.into(record)
        if (LocalDateTime.now().isAfter(record.createTime!!.plusDays(5)))
            record.status = "超时完成"
        else record.status = "已完成"
        record.deptName =
            userService.getUserOrganizationById(userAccount.organizationIds.first())?.name
                ?: ""
        record.name = userAccount.realName
        record.updateById()
        projectDigitalProjectReviewService.updateTaskStatus(record.id!!)
        // 校验7个部门全部完成
        val cnt = queryCount<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq dto.digitalInvestmentId)
            and(ProjectDigitalProjectReviewAll::status eq "未完成")
            and(ProjectDigitalProjectReviewAll::step eq ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION)
        }
        if (cnt == 0L) {
            val investment = queryOneById<ProjectDigitalInvestmentAttracting>(dto.digitalInvestmentId)
            if (investment != null) {
                investment.isQualityEvaluationComplete = true
                investment.updateById()
                projectDigitalProjectReviewService.evaluationCallBack(investment)
            }
        }
        return SimpleValueDTO(true)
    }
}
