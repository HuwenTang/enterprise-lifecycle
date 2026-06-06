package com.tzdig.framework.model.vo.fagai

import com.tzdig.framework.web.annotation.JsonAreaName
import io.swagger.v3.oas.annotations.media.Schema

data class StatisticalInvestmentTreeVO(
    @get:Schema(description = "市（区）")
    val district: String,
    @get:Schema(description = "园区")
    val park: String,
    @get:Schema(description = "项目总数")
    val totalCount: Int,
    @get:Schema(description = "计划总投资")
    val totalInvestment: Double,
    @get:Schema(description = "本月列统投资")
    val monthStatisticalInvestment: Double,
    @get:Schema(description = "本年列统投资")
    val yearStatisticalInvestment: Double,
    @get:Schema(description = "累计列统投资")
    val totalStatisticalInvestment: Double,
    @get:Schema(description = "本月新增入库")
    val monthIncreasement: Int,
    @get:Schema(description = "本年新增入库")
    val yearIncreasement: Int,
    @get:Schema(description = "计划总投资")
    val yearInvestment: Double,
    @get:Schema(description = "children")
    val children: List<StatisticalInvestmentTreeVO> = emptyList(),
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
}
