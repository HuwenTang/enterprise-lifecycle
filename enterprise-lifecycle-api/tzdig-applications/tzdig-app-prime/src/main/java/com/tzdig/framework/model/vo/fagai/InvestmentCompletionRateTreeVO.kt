package com.tzdig.framework.model.vo.fagai

import com.fasterxml.jackson.annotation.JsonIgnore
import com.tzdig.framework.core.annotation.JsonDecimal
import com.tzdig.framework.web.annotation.JsonAreaName
import io.swagger.v3.oas.annotations.media.Schema

data class InvestmentCompletionRateTreeVO(
    @get:Schema(description = "市（区）")
    val district: String,
    @get:Schema(description = "园区")
    val park: String,
    @get:Schema(description = "本月竣工项目")
    val month: KeyProjectsItem,
    @get:Schema(description = "本月竣工项目")
    val year: KeyProjectsItem,
    @get:Schema(description = "入库投资情况")
    val statisticalInvestment: KeyProjectsItem,
    @get:Schema(description = "项目入库数量", hidden = true)
    @JsonIgnore
    val statisticalCount: Int,
    @get:Schema(description = "项目总数", hidden = true)
    @JsonIgnore
    val statisticalCountTotal: Int,
    @get:Schema(description = "列统投资金额", hidden = true)
    @JsonIgnore
    val statisticalAmount: Double,
    @get:Schema(description = "项目总金额", hidden = true)
    @JsonIgnore
    val statisticalAmountTotal: Double,
    @get:Schema(description = "children")
    val children: List<InvestmentCompletionRateTreeVO> = emptyList(),
) {
    @Suppress("unused")
    @get:Schema(description = "市（区）")
    @get:JsonAreaName
    val districtName: String
        get() = district

    @Suppress("unused")
    @get:Schema(description = "园区")
    @get:JsonAreaName
    val parkName: String
        get() = park

    @Suppress("unused")
    @get:Schema(description = "项目入库比例(%)")
    @get:JsonDecimal(2)
    val statisticalCountRate: Double?
        get() = if (statisticalCount <= 0 || statisticalCountTotal <= 0) null
        else 100.0 * statisticalCount / statisticalCountTotal

    @Suppress("unused")
    @get:Schema(description = "列统投资比例(%)")
    @get:JsonDecimal(2)
    val statisticalAmountRate: Double?
        get() = if (statisticalAmount <= 0 || statisticalAmountTotal <= 0) null
        else 100.0 * statisticalAmount / statisticalAmountTotal
}
