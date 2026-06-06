@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEconomicPerformanceStats
import java.math.BigDecimal

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectDcdxEconomicPerformanceStatsExcelRow(
    @field:ExcelProperty("市区名称")
    var district: String? = null,
    @field:ExcelProperty("园区名称")
    var park: String? = null,
    @field:ExcelProperty("年份")
    var year: Int? = null,
    @field:ExcelProperty("产值 - 实绩（万元）")
    var outputActual: BigDecimal? = null,
    @field:ExcelProperty("产值增长贡献 &#61; (项目形成产值 / 全市规上工业产值增量) * 100%（百分比，单位：%）")
    var outputGrowthContribution: BigDecimal? = null,
    @field:ExcelProperty("开票 - 实绩（万元）")
    var invoiceActual: BigDecimal? = null,
    @field:ExcelProperty("开票 - 预期（万元）")
    var invoiceExpected: BigDecimal? = null,
    @field:ExcelProperty("开票达效率 &#61; (开票实绩 / 预期开票) * 100%（小数形式）")
    var invoiceEfficiencyRate: BigDecimal? = null,
    @field:ExcelProperty("营收（万元）")
    var revenue: BigDecimal? = null,
    @field:ExcelProperty("利润（万元）")
    var profit: BigDecimal? = null,
    @field:ExcelProperty("利润率 &#61; (利润 / 营业收入) * 100%（小数形式）")
    var profitMargin: BigDecimal? = null,
    @field:ExcelProperty("税收 - 实绩（万元）")
    var taxActual: BigDecimal? = null,
    @field:ExcelProperty("税收 - 预期（万元）")
    var taxExpected: BigDecimal? = null,
    @field:ExcelProperty("税收达效率 &#61; (税收实绩 / 税收预期) * 100%（小数形式）")
    var taxEfficiencyRate: BigDecimal? = null,
    @field:ExcelProperty("所属产业链群，如：新能源、生物医药、高端装备等")
    var industrialChainCluster: String? = null,
    @field:ExcelProperty("是否产业链群")
    var isLq: Boolean? = null,
) : ExcelRow<ProjectDcdxEconomicPerformanceStatsExcelRow>() {
    fun toProjectDcdxEconomicPerformanceStats(): ProjectDcdxEconomicPerformanceStats =
        ProjectDcdxEconomicPerformanceStats {
            into(this)
        }

    fun into(record: ProjectDcdxEconomicPerformanceStats): ProjectDcdxEconomicPerformanceStats {
        record.district = district
        record.park = park
        record.year = year
        record.outputActual = outputActual
        record.outputGrowthContribution = outputGrowthContribution
        record.invoiceActual = invoiceActual
        record.invoiceExpected = invoiceExpected
        record.invoiceEfficiencyRate = invoiceEfficiencyRate
        record.revenue = revenue
        record.profit = profit
        record.profitMargin = profitMargin
        record.taxActual = taxActual
        record.taxExpected = taxExpected
        record.taxEfficiencyRate = taxEfficiencyRate
        record.industrialChainCluster = industrialChainCluster
        record.isLq = isLq
        return record
    }
}
