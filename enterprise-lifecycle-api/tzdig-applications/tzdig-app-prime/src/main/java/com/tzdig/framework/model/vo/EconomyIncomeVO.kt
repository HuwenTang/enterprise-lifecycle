package com.tzdig.framework.model.vo

import com.fasterxml.jackson.annotation.JsonIgnore
import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

@Suppress("unused")
data class EconomyIncomeVO(
    @get:Schema(description = "年份")
    val year: Int,
    @get:Schema(description = "季度")
    val quarter: Int,
    @get:Schema(description = "地区")
    val region: String?,
    @get:Schema(description = "指标名称")
    val name: String?,
    @get:Schema(description = "营收")
    @get:JsonDecimal(2)
    val revenue: Float,
    @JsonIgnore
    @get:Schema(description = "总营收")
    val totalRevenue: Float,
    @JsonIgnore
    @get:Schema(description = "同比营收")
    val revenue4tb: Float,
    @JsonIgnore
    @get:Schema(description = "环比营收")
    val revenue4hb: Float?,
) {
    @get:Schema(description = "同比")
    @get:JsonDecimal(2)
    val tb: Float?
        get() = if (revenue4tb <= 0) null
        else 100f * (revenue - revenue4tb) / revenue4tb

    @get:Schema(description = "环比")
    @get:JsonDecimal(2)
    val hb: Float?
        get() = if (revenue4hb == null || revenue4hb <= 0) null
        else 100f * (revenue - revenue4hb) / revenue4hb

    @get:Schema(description = "占比")
    @get:JsonDecimal(2)
    val rank: Float?
        get() = if (totalRevenue <= 0) null
        else 100f * revenue / totalRevenue
}
