package com.tzdig.framework.model.vo

import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

data class EconomyIncomeCountyVO(
    @Schema(description = "地区")
    val region: String? = null,
    @Schema(description = "年份")
    val year: Int = 0,
    @Schema(description = "季度")
    val quarter: Int = 1,
    @Schema(description = "同比")
    @get:JsonDecimal(2)
    val tb: Float?,
    @Schema(description = "环比")
    @get:JsonDecimal(2)
    val hb: Float?,
    @Schema(description = "占比")
    @get:JsonDecimal(2)
    val rank: Float?,
)
