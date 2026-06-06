@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.IndustryChain
import io.swagger.v3.oas.annotations.media.Schema

data class IndustryChainDTO(
    @Schema(description = "产业集群分类")
    val cluster: String?,
    @Schema(description = "所属产业链")
    val chains: String?,
    @Schema(description = "企业数量")
    val companyNumber: Int?,
    @Schema(description = "本期产值")
    val output: Float?,
    @Schema(description = "产值增长 （%）")
    val outputIncrement: Float?,
    @Schema(description = "本期营收（亿元）")
    val revenue: Float?,
    @Schema(description = "营收增长(%)")
    val revenueIncrement: Float?,
    @Schema(description = "本期利润")
    val profit: Float?,
    @Schema(description = "利润增长（%）")
    val profitIncrement: Float?,
) {
    fun toIndustryChain(): IndustryChain =
        IndustryChain {
            into(this)
        }

    fun into(record: IndustryChain): IndustryChain {
        record.cluster = cluster
        record.chains = chains
        record.companyNumber = companyNumber
        record.output = output
        record.outputIncrement = outputIncrement
        record.revenue = revenue
        record.revenueIncrement = revenueIncrement
        record.profit = profit
        record.profitIncrement = profitIncrement
        return record
    }
}
