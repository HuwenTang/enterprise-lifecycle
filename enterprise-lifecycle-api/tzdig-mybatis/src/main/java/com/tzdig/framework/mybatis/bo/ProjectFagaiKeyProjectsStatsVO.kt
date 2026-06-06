package com.tzdig.framework.mybatis.bo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiKeyProjectsStats
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectFagaiKeyProjectsStatsVO(
    @get:Schema(description = "市区")
    @ExcelProperty("市区")
    val city: String?,
    @get:Schema(description = "园区名称，如：靖江市、高新区等")
    @ExcelProperty("园区名称，如：靖江市、高新区等")
    val park: String?,
    @get:Schema(description = "所属产业链群，如：新能源、生物医药等")
    @ExcelProperty("所属产业链群，如：新能源、生物医药等")
    val industrialChainCluster: String?,
    @get:Schema(description = "市级重点项目总数")
    @ExcelProperty("市级重点项目总数")
    val projectCountTotal: Int?,
    @get:Schema(description = "其中：外资项目数量")
    @ExcelProperty("其中：外资项目数量")
    val projectCountForeignInvestment: Int?,
    @get:Schema(description = "其中：内资项目数量")
    @ExcelProperty("其中：内资项目数量")
    val projectCountDomesticInvestment: Int?,
    @get:Schema(description = "计划总投资总额（万元）")
    @ExcelProperty("计划总投资总额（万元）")
    val plannedInvestmentTotal: BigDecimal?,
    @get:Schema(description = "其中：外资项目计划总投资（万元）")
    @ExcelProperty("其中：外资项目计划总投资（万元）")
    val plannedInvestmentForeign: BigDecimal?,
    @get:Schema(description = "其中：内资项目计划总投资（万元）")
    @ExcelProperty("其中：内资项目计划总投资（万元）")
    val plannedInvestmentDomestic: BigDecimal?,
    @get:Schema(description = "其中：项目列统投资累计列统投资")
    @ExcelProperty("其中：项目列统投资累计列统投资")
    val inInvest: BigDecimal?,
    @get:Schema(description = "投资完成率")
    @ExcelProperty("投资完成率")
    val ratio: BigDecimal?,
) {
    constructor(record: ProjectFagaiKeyProjectsStats) : this(
        city = record.city,
        park = record.park,
        industrialChainCluster = record.industrialChainCluster,
        projectCountTotal = record.projectCountTotal,
        projectCountForeignInvestment = record.projectCountForeignInvestment,
        projectCountDomesticInvestment = record.projectCountDomesticInvestment,
        plannedInvestmentTotal = record.plannedInvestmentTotal,
        plannedInvestmentForeign = record.plannedInvestmentForeign,
        plannedInvestmentDomestic = record.plannedInvestmentDomestic,
        inInvest = record.inInvest,
        ratio = record.ratio,
    )
}
