package com.tzdig.framework.model.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

data class ProjectDigitalInvestmentAttractingParam(
    @get:Schema(description = "年份")
    val year: Int? = null,
    @get:Schema(description = "是否仅当月", defaultValue = "false")
    val currentMonth: Boolean = false,
    @get:Schema(description = "项目代码")
    val projectCode: String? = null,
    @get:Schema(description = "项目名称")
    val projectName: String? = null,
    @get:Schema(description = "当前项目进度", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val currentProjectProgress: List<String> = emptyList(),
    @get:Schema(description = "是否已签约")
    val signedProject: Boolean? = null,
    @get:Schema(description = "项目内容")
    val projectContent: String? = null,
    @get:Schema(description = "投资标识")
    val investmentFlag: String? = null,
    @get:Schema(description = "投资金额")
    val investmentAmount: Float? = null,
    @get:Schema(description = "是否是质量评价")
    val isQualityEvaluation: Boolean? = null,
    @get:Schema(description = "质量评价是否已完成")
    val qualityEvaluationCompleted: Boolean? = null,
    @get:Schema(description = "是否需要项目审核")
    val isProjectReview: Boolean? = null,
    @get:Schema(description = "项目审核是否已完成")
    val projectReviewCompleted: Boolean? = null,
    @get:Schema(description = "是否显示全部", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    val showAll: Boolean = true,
    @get:Schema(description = "是否需要开工认定")
    val isStartApproval: Boolean? = null,
    @get:Schema(description = "是否需要竣工认定")
    val isCompletionApproval: Boolean? = null,
    @get:Schema(description = "招引单位")
    val attractorUnit: String? = null,
    @get:Schema(description = "是否三个大抓项目")
    val isSDZProject: Boolean? = null,
    @get:Schema(description = "工业或服务业")
    val industryOrService: String? = null,
    @get:Schema(description = "签约审核状态")
    val signedProjectStatus: Int? = null,
    @get:Schema(description = "开工审核状态")
    val startApprovalStatus: Int? = null,
    @get:Schema(description = "质态评估审核状态")
    val qualityEvaluationStatus: Int? = null,
    @get:Schema(description = "申请时间开始")
    val applyTime1: LocalDate? = null,
    @get:Schema(description = "申请时间结束")
    val applyTime2: LocalDate? = null
)
