package com.tzdig.framework.model.vo

import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

data class RevenueRatioVO(
    @Schema(description = "地区")
    val area: String? = null,
    @Schema(description = "营收占比指标")
    @get:JsonDecimal(2)
    val ratio: Float? = null,
    @Schema(description = "营收额完成指标")
    @get:JsonDecimal(2)
    val revenueRatio: Float? = null
)
