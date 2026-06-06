package com.tzdig.framework.model.vo.fagai

import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

data class InvestmentOverview(
    @get:Schema(description = "在建项目")
    val underConstruction: UnderConstruction,
    @get:Schema(description = "入库投资")
    val statisticalInvestment: StatisticalInvestment,
    @get:Schema(description = "投资完成率")
    val investmentCompletion: InvestmentCompletion,
    @get:Schema(description = "链群分布")
    val industrialChainDistribution: IndustrialChainDistribution,
) {
    data class UnderConstruction(
        @get:Schema(description = "本月新增")
        val monthIncreasement: Long,
        @get:Schema(description = "当年累计新增")
        val yearIncreasement: Long,
        @get:Schema(description = "计划总投资")
        @get:JsonDecimal(2)
        val plannedTotalInvestment: Double,
    )

    data class StatisticalInvestment(
        @get:Schema(description = "本月新增入库")
        val monthCount: Long,
        @get:Schema(description = "本月入库投资")
        @get:JsonDecimal(2)
        val monthAmount: Double,
        @get:Schema(description = "当年累计新增入库")
        val yearCount: Long,
        @get:Schema(description = "当年累计入库投资")
        @get:JsonDecimal(2)
        val yearAmount: Double,
    )

    data class InvestmentCompletion(
        @get:Schema(description = "本月竣工")
        val monthCompletion: Long,
        @get:Schema(description = "当年累计竣工")
        val yearCompletion: Long,
        @get:Schema(description = "计划总投资")
        @get:JsonDecimal(2)
        val plannedTotalInvestment: Double,
        @get:Schema(description = "实际完成投资")
        @get:JsonDecimal(2)
        val actualTotalInvestment: Double,
    )

    data class IndustrialChainDistribution(
        @get:Schema(description = "工业项目")
        val industryProjectCount: Long,
        @get:Schema(description = "工业项目-计划总投资")
        @get:JsonDecimal(2)
        val industryProjectPlannedTotalInvestment: Double,
        @get:Schema(description = "重点链群项目")
        val industrialChainProjectCount: Long,
        @get:Schema(description = "重点链群项目-计划总投资")
        @get:JsonDecimal(2)
        val industrialChainPlannedTotalInvestment: Double,
    )
}
