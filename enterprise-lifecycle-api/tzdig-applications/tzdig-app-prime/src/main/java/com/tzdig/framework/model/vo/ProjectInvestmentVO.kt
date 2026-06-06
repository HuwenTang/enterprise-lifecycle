package com.tzdig.framework.model.vo

import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectInvestmentVO(
    @Schema(description = "年份")
    var year: Int = 0,
    @Schema(description = "项目总数")
    var projectTotal: Int = 0,
    @Schema(description = "地区项目总数")
    var areaTotal: Int = 0,
    @Schema(description = "地区")
    val area: String =  "",
    @Schema(description = "占比")
    @get:JsonDecimal(2)
    val ratio: Double = 0.0,
)
