package com.tzdig.framework.model.vo.fagai

import com.fasterxml.jackson.annotation.JsonIgnore
import com.tzdig.framework.core.annotation.JsonDecimal
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema

data class IndustrialChainDistributionTreeVO(
    @get:Schema(description = "创新集群")
    val innovativeCluster: String,
    @get:Schema(description = "产业链")
    val industrialChain: String,
    @get:Schema(description = "项目数量")
    val projectCount: Int,
    @get:Schema(description = "项目总数", hidden = true)
    @JsonIgnore
    val projectCountTotal: Int,
    @get:Schema(description = "投资额")
    val investmentAmount: Double,
    @get:Schema(description = "投资总额", hidden = true)
    @JsonIgnore
    val investmentAmountTotal: Double,
    @get:Schema(description = "children")
    val children: List<IndustrialChainDistributionTreeVO> = emptyList(),
) {
    @Suppress("unused")
    @get:Schema(description = "项目比重(%)")
    @get:JsonDecimal(2)
    val projectProportion: Double?
        get() = if (projectCount <= 0 || projectCountTotal <= 0) null
        else 100.0 * projectCount / projectCountTotal

    @Suppress("unused")
    @get:Schema(description = "投资比重(%)")
    @get:JsonDecimal(2)
    val investmentProportion: Double?
        get() = if (investmentAmount <= 0 || investmentAmountTotal <= 0) null
        else 100.0 * investmentAmount / investmentAmountTotal

    @Suppress("unused")
    @get:Schema(description = "创新集群")
    @get:JsonLabel("8_13_X")
    val innovativeClusterLabel: String = innovativeCluster

    @Suppress("unused")
    @get:Schema(description = "产业链")
    @get:JsonLabel("8_13_X")
    val industrialChainLabel: String = industrialChain

}
