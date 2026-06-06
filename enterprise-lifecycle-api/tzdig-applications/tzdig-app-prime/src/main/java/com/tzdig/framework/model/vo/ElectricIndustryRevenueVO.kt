package com.tzdig.framework.model.vo

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ElectricIndustryRevenueVO(
    @Schema(description = "市区")
    val city: String? = null,
    @Schema(description = "预期营收（亿元）")
    val expectRevenues: BigDecimal? = null,
    @Schema(description = "实际营收（亿元）")
    val realRevenues: BigDecimal? = null,
    @Schema(description = "达产率")
    val reachability: BigDecimal? = null,
    @Schema(description = "营业收入总数")
    val totalOperatingIncome: BigDecimal? = null,
    @Schema(description = "占比")
    val ratio: BigDecimal? = null
)
