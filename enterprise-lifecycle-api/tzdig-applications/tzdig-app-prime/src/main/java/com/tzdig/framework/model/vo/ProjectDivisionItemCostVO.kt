package com.tzdig.framework.model.vo

import com.tzdig.framework.core.annotation.JsonDecimal
import com.tzdig.framework.web.annotation.JsonAreaName
import io.swagger.v3.oas.annotations.media.Schema
import java.util.*

class ProjectDivisionItemCostVO(
    val id: String = UUID.randomUUID().toString(),
    @get:Schema(description = "市（区）代码")
    val district: String,
    @get:Schema(description = "园区代码")
    val park: String,
    @get:Schema(description = "已完成施工图审查项目数量")
    var drawingReviewFinishCount: Long = 0L,
    @get:Schema(description = "已提交施工图审查项目数量")
    var drawingReviewSubmitCount: Long = 0L,
    @get:Schema(description = "施工图总用时")
    var drawingReviewCostTime: Long = 0L,
    @get:Schema(description = "已完成环评项目数量")
    var envAssessmentFinishCount: Long = 0L,
    @get:Schema(description = "已提交环评项目数量")
    var envAssessmentSubmitCount: Long = 0L,
    @get:Schema(description = "环评总用时")
    var envAssessmentCostTime: Long = 0L,
    @get:Schema(description = "已完成能评项目数量")
    var energyAssessmentFinishCount: Long = 0L,
    @get:Schema(description = "已提交能评项目数量")
    var energyAssessmentSubmitCount: Long = 0L,
    @get:Schema(description = "能评总用时")
    var energyAssessmentCostTime: Long = 0L,
    @get:Schema(description = "施工许可数量")
    var constructionPermitsCount: Long = 0L,
    @get:Schema(description = "children")
    val children: List<ProjectDivisionItemCostVO>,
) {
    @Suppress("unused")
    @get:JsonAreaName
    @get:Schema(description = "市（区）名称")
    val districtName: String
        get() = district

    @Suppress("unused")
    @get:JsonAreaName
    @get:Schema(description = "园区名称")
    val parkName: String
        get() = park

    @Suppress("unused")
    @get:JsonDecimal(2)
    @get:Schema(description = "施工图平均用时")
    val avgDrawingReviewCostTime: Float
        get() = divide(drawingReviewCostTime, drawingReviewSubmitCount + drawingReviewFinishCount)

    @Suppress("unused")
    @get:JsonDecimal(2)
    @get:Schema(description = "环评平均用时")
    val avgEnvAssessmentCostTime: Float
        get() = divide(envAssessmentCostTime, envAssessmentSubmitCount + envAssessmentFinishCount)

    @Suppress("unused")
    @get:JsonDecimal(2)
    @get:Schema(description = "能评平均用时")
    val avgEnergyAssessmentCostTime: Float
        get() = divide(energyAssessmentCostTime, energyAssessmentSubmitCount + energyAssessmentFinishCount)

    private fun divide(costTime: Long?, count: Long?): Float =
        if (costTime == null || count == null || count <= 0) 0f
        else 1f * costTime / count / 3600
}
