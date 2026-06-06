package com.tzdig.framework.service.impl

import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.DeptConstant
import com.tzdig.framework.model.vo.ProjectTimeFlowVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.service.ProjectTimeFlowService
import com.tzdig.framework.web.exception.NotFoundException
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ProjectTimeFlowServiceImpl(
    private val userService: UserService,
) : ProjectTimeFlowService {
    private fun getProjectTimeFlow(
        investmentId: String,
        progress: String,
        step: ProjectDigitalProjectReviewAll.Step,
    ): List<ProjectTimeFlowVO> {
        val stepName = when (step) {
            ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION -> "质态评估"
            ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW -> "签约核定·部门审核"
            ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB -> "签约核定·专班审核"
            PROJECT_START_REVIEW -> "开工认定"
            ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW -> "竣工认定"
//            ProjectDigitalProjectReviewAll.Step.PROJECT_START_REVIEW_ZB -> "开工专班审核"
            else -> "其他"
        }
        val records = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq investmentId)
            and(ProjectDigitalProjectReviewAll::step eq step)
        }
        val list = records.map { record ->
            val title =
                if (record.step == PROJECT_START_REVIEW) {
                    DeptConstant.FAGAI_LIST.find { it.first.first == record.cobId }
                        ?.second
                } else {
                    record.cobId
                        ?.let { userService.getUserOrganizationById(it) }
                        ?.name
                }
            val completed = record.status != "未完成"
            ProjectTimeFlowVO(
                isPrimary = false,
                progress = progress,
                title = title ?: stepName,
                time = record.updateTime.takeIf { completed },
                name = record.name,
                result = when (record.result) {
                    "0" -> "退回"
                    "1" -> "通过"
                    "2" -> "未通过"
                    "3" -> "不计分"
                    else -> "待审核"
                },
                comment = record.comment,
                completed = completed,
            )
        }
            .sortedBy { it.time ?: LocalDateTime.MIN }
            .toMutableList()
        if (list.isNotEmpty()) {
            list.add(
                0, ProjectTimeFlowVO(
                    isPrimary = true,
                    progress = progress,
                    title = "提交${stepName}",
                    time = records.minOf { it.createTime!! },
                )
            )
            val investment = queryOneById<ProjectDigitalInvestmentAttracting>(investmentId)
            val completed = when (step) {
                ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION -> investment?.isQualityEvaluationComplete == true
                ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW -> false
                else -> list.all { it.completed == true }
            }
            if (completed) list.add(
                ProjectTimeFlowVO(
                    isPrimary = true,
                    progress = progress,
                    title = "完成${stepName}",
                    time = records.maxOf { it.updateTime!! },
                )
            )
        }
        return list
    }

    override fun getTimeFlow(id: String): List<ProjectTimeFlowVO> {
        val record = queryOneById<ProjectDigitalInvestmentAttracting>(id)
            ?: throw NotFoundException("数字化招商不存在")
        val result = mutableListOf<ProjectTimeFlowVO>()
        // 在谈
        if (record.entryTime != null)
            result.add(
                ProjectTimeFlowVO(
                    isPrimary = true,
                    progress = "在谈",
                    title = "创建项目",
                    time = record.entryTime,
                )
            )
        // 签约
        if (record.actualSigningTime != null)
            result.add(
                ProjectTimeFlowVO(
                    isPrimary = true,
                    progress = "签约",
                    title = "签约",
                    time = record.actualSigningTime!!.atTime(0, 0),
                )
            )
        result.addAll(getProjectTimeFlow(id, "签约", ProjectDigitalProjectReviewAll.Step.QUALITY_EVALUATION))
        result.addAll(getProjectTimeFlow(id, "签约", ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW))
        result.addAll(getProjectTimeFlow(id, "签约", ProjectDigitalProjectReviewAll.Step.PROJECT_REVIEW_ZB))
        // 注册
        if (record.companyRegistrationDate != null)
            result.add(
                ProjectTimeFlowVO(
                    isPrimary = true,
                    progress = "注册",
                    title = "完成注册",
                    time = record.companyRegistrationDate!!.atTime(0, 0),
                )
            )
        // 备案
        if (record.filingApprovalDate != null)
            result.add(
                ProjectTimeFlowVO(
                    isPrimary = true,
                    progress = "备案",
                    title = "完成备案",
                    time = record.filingApprovalDate!!.atTime(0, 0),
                )
            )
        // 报批
        if (record.permitObtainDate != null)
            result.add(
                ProjectTimeFlowVO(
                    isPrimary = true,
                    progress = "报批",
                    title = "完成报批",
                    time = record.permitObtainDate!!.atTime(0, 0),
                )
            )
        // 开工
        result.addAll(getProjectTimeFlow(id, "开工", PROJECT_START_REVIEW))
        // 竣工
        result.addAll(getProjectTimeFlow(id, "竣工", ProjectDigitalProjectReviewAll.Step.PROJECT_COMPLETION_REVIEW))
        return result
    }
}
