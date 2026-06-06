@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEconomicPerformanceStats
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectDcdxEconomicPerformanceStatsVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "市区名称")
    @ExcelProperty("市区名称")
    val district: String?,
    @get:Schema(description = "园区名称")
    @ExcelProperty("园区名称")
    val park: String?,
    @get:Schema(description = "年份")
    @ExcelProperty("年份")
    val year: Int?,
    @get:Schema(description = "产值 - 实绩（万元）")
    @ExcelProperty("产值 - 实绩（万元）")
    val outputActual: BigDecimal?,
    @get:Schema(description = "产值增长贡献 &#61; (项目形成产值 / 全市规上工业产值增量) * 100%（百分比，单位：%）")
    @ExcelProperty("产值增长贡献 &#61; (项目形成产值 / 全市规上工业产值增量) * 100%（百分比，单位：%）")
    val outputGrowthContribution: BigDecimal?,
    @get:Schema(description = "开票 - 实绩（万元）")
    @ExcelProperty("开票 - 实绩（万元）")
    val invoiceActual: BigDecimal?,
    @get:Schema(description = "开票 - 预期（万元）")
    @ExcelProperty("开票 - 预期（万元）")
    val invoiceExpected: BigDecimal?,
    @get:Schema(description = "开票达效率 &#61; (开票实绩 / 预期开票) * 100%（小数形式）")
    @ExcelProperty("开票达效率 &#61; (开票实绩 / 预期开票) * 100%（小数形式）")
    val invoiceEfficiencyRate: BigDecimal?,
    @get:Schema(description = "营收（万元）")
    @ExcelProperty("营收（万元）")
    val revenue: BigDecimal?,
    @get:Schema(description = "利润（万元）")
    @ExcelProperty("利润（万元）")
    val profit: BigDecimal?,
    @get:Schema(description = "利润率 &#61; (利润 / 营业收入) * 100%（小数形式）")
    @ExcelProperty("利润率 &#61; (利润 / 营业收入) * 100%（小数形式）")
    val profitMargin: BigDecimal?,
    @get:Schema(description = "税收 - 实绩（万元）")
    @ExcelProperty("税收 - 实绩（万元）")
    val taxActual: BigDecimal?,
    @get:Schema(description = "税收 - 预期（万元）")
    @ExcelProperty("税收 - 预期（万元）")
    val taxExpected: BigDecimal?,
    @get:Schema(description = "税收达效率 &#61; (税收实绩 / 税收预期) * 100%（小数形式）")
    @ExcelProperty("税收达效率 &#61; (税收实绩 / 税收预期) * 100%（小数形式）")
    val taxEfficiencyRate: BigDecimal?,
    @get:Schema(description = "所属产业链群，如：新能源、生物医药、高端装备等")
    @ExcelProperty("所属产业链群，如：新能源、生物医药、高端装备等")
    val industrialChainCluster: String?,
    @get:Schema(description = "是否产业链群")
    @ExcelProperty("是否产业链群")
    val isLq: Boolean?,
) {
    constructor(record: ProjectDcdxEconomicPerformanceStats) : this(
        id = record.id,
        district = record.district,
        park = record.park,
        year = record.year,
        outputActual = record.outputActual,
        outputGrowthContribution = record.outputGrowthContribution,
        invoiceActual = record.invoiceActual,
        invoiceExpected = record.invoiceExpected,
        invoiceEfficiencyRate = record.invoiceEfficiencyRate,
        revenue = record.revenue,
        profit = record.profit,
        profitMargin = record.profitMargin,
        taxActual = record.taxActual,
        taxExpected = record.taxExpected,
        taxEfficiencyRate = record.taxEfficiencyRate,
        industrialChainCluster = record.industrialChainCluster,
        isLq = record.isLq,
    )
}
