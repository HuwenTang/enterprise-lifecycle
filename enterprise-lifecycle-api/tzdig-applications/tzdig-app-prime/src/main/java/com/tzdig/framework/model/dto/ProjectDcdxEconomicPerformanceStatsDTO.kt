@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEconomicPerformanceStats
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectDcdxEconomicPerformanceStatsDTO(
    @param:Schema(description = "市区名称")
    val district: String?,
    @param:Schema(description = "园区名称")
    val park: String?,
    @param:Schema(description = "年份")
    val year: Int?,
    @param:Schema(description = "产值 - 实绩（万元）")
    val outputActual: BigDecimal?,
    @param:Schema(description = "产值增长贡献 &#61; (项目形成产值 / 全市规上工业产值增量) * 100%（百分比，单位：%）")
    val outputGrowthContribution: BigDecimal?,
    @param:Schema(description = "开票 - 实绩（万元）")
    val invoiceActual: BigDecimal?,
    @param:Schema(description = "开票 - 预期（万元）")
    val invoiceExpected: BigDecimal?,
    @param:Schema(description = "开票达效率 &#61; (开票实绩 / 预期开票) * 100%（小数形式）")
    val invoiceEfficiencyRate: BigDecimal?,
    @param:Schema(description = "营收（万元）")
    val revenue: BigDecimal?,
    @param:Schema(description = "利润（万元）")
    val profit: BigDecimal?,
    @param:Schema(description = "利润率 &#61; (利润 / 营业收入) * 100%（小数形式）")
    val profitMargin: BigDecimal?,
    @param:Schema(description = "税收 - 实绩（万元）")
    val taxActual: BigDecimal?,
    @param:Schema(description = "税收 - 预期（万元）")
    val taxExpected: BigDecimal?,
    @param:Schema(description = "税收达效率 &#61; (税收实绩 / 税收预期) * 100%（小数形式）")
    val taxEfficiencyRate: BigDecimal?,
    @param:Schema(description = "所属产业链群，如：新能源、生物医药、高端装备等")
    val industrialChainCluster: String?,
    @param:Schema(description = "是否产业链群")
    val isLq: Boolean?,
) {
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
