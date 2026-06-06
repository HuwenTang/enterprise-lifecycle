@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.bo.ProjectFagaiKeyProjectsStatsVO
import com.tzdig.framework.web.annotation.JsonAreaName
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.util.UUID.randomUUID

data class ProjectFagaiKeyProjectsStatsMergedVO(
    val id: String?,
    @get:Schema(description = "市区")
    var city: String?,
    @get:Schema(description = "园区名称，如：靖江市、高新区等")
    @get:JsonAreaName
    var park: String?,
    @get:Schema(description = "所属产业链群，如：新能源、生物医药等")
    val industrialChainCluster: String?,
    @get:Schema(description = "市级重点项目总数")
    val projectCountTotal1: Int?,
    @get:Schema(description = "其中：外资项目数量")
    val projectCountForeignInvestment1: Int?,
    @get:Schema(description = "其中：内资项目数量")
    val projectCountDomesticInvestment1: Int?,
    @get:Schema(description = "计划总投资总额（亿元）")
    val plannedInvestmentTotal1: BigDecimal?,
    @get:Schema(description = "其中：外资项目计划总投资（亿元）")
    val plannedInvestmentForeign1: BigDecimal?,
    @get:Schema(description = "其中：内资项目计划总投资（亿元）")
    val plannedInvestmentDomestic1: BigDecimal?,
    @get:Schema(description = "其中：入库投资额")
    @ExcelProperty("其中：入库投资额")
    val inInvest1: BigDecimal?,
    @get:Schema(description = "投资完成率")
    @ExcelProperty("投资完成率")
    val ratio1: BigDecimal?,

    @get:Schema(description = "市级重点项目总数")
    val projectCountTotal2: Int?,
    @get:Schema(description = "其中：外资项目数量")
    val projectCountForeignInvestment2: Int?,
    @get:Schema(description = "其中：内资项目数量")
    val projectCountDomesticInvestment2: Int?,
    @get:Schema(description = "计划总投资总额（亿元）")
    val plannedInvestmentTotal2: BigDecimal?,
    @get:Schema(description = "其中：外资项目计划总投资（亿元）")
    val plannedInvestmentForeign2: BigDecimal?,
    @get:Schema(description = "其中：内资项目计划总投资（亿元）")
    val plannedInvestmentDomestic2: BigDecimal?,
    @get:Schema(description = "其中：入库投资额")
    @ExcelProperty("其中：入库投资额")
    val inInvest2: BigDecimal?,
    @get:Schema(description = "投资完成率")
    @ExcelProperty("投资完成率")
    val ratio2: BigDecimal?,

    val children: MutableList<ProjectFagaiKeyProjectsStatsMergedVO>,
) {
    constructor(
        key: Triple<String?, String?, String?>,
        record1: ProjectFagaiKeyProjectsStatsVO?,
        record2: ProjectFagaiKeyProjectsStatsVO?,
    ) : this(
        id = randomUUID().toString(),
        city = key.first,
        park = key.second,
        industrialChainCluster = key.third,
        projectCountTotal1 = record1?.projectCountTotal,
        projectCountForeignInvestment1 = record1?.projectCountForeignInvestment,
        projectCountDomesticInvestment1 = record1?.projectCountDomesticInvestment,
        plannedInvestmentTotal1 = record1?.plannedInvestmentTotal,
        plannedInvestmentForeign1 = record1?.plannedInvestmentForeign,
        plannedInvestmentDomestic1 = record1?.plannedInvestmentDomestic,
        inInvest1 = record1?.inInvest,
        ratio1 = record1?.ratio,
        projectCountTotal2 = record2?.projectCountTotal,
        projectCountForeignInvestment2 = record2?.projectCountForeignInvestment,
        projectCountDomesticInvestment2 = record2?.projectCountDomesticInvestment,
        plannedInvestmentTotal2 = record2?.plannedInvestmentTotal,
        plannedInvestmentForeign2 = record2?.plannedInvestmentForeign,
        plannedInvestmentDomestic2 = record2?.plannedInvestmentDomestic,
        inInvest2 = record2?.inInvest,
        ratio2 = record2?.ratio,
        children = mutableListOf(),
    )
}
