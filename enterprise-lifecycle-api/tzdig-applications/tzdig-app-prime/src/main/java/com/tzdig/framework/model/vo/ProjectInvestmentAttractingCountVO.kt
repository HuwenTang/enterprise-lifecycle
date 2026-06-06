package com.tzdig.framework.model.vo

import com.mybatisflex.annotation.Table
import com.tzdig.framework.core.annotation.JsonDecimal
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema

@Table("project_digital_investment_attracting")
data class ProjectInvestmentAttractingCountVO(
    @get:Schema(description = "当前项目进度")
    val currentProjectProgress: String?,
    @get:Schema(description = "数量")
    val count: Long = 0,
    @get:Schema(description = "项目金额")
    @get:JsonDecimal(4)
    val projectAmount: Double? = null,
) {
    @Schema(description = "当前项目进度")
    @get:JsonLabel("project_progress")
    var currentProjectProgressLabel: String? = null
        get() = currentProjectProgress
        private set
}
