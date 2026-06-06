@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxChainClusterPerformance
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectDcdxChainClusterPerformanceDTO(
    @param:Schema(description = "市区名称")
    val district: String?,
    @param:Schema(description = "园区名称")
    val park: String?,
    @param:Schema(description = "年份")
    val year: Int?,
    @param:Schema(description = "所属产业链群，如：新能源、生物医药、高端装备等")
    val industrialChainCluster: String?,
    @param:Schema(description = "产业链群合计产值（亿元）")
    val clusterTotalOutput: BigDecimal?,
    @param:Schema(description = "同比增长（%），小数形式（如 0.1234 表示 12.34%）")
    val yearOnYearGrowth: BigDecimal?,
    @param:Schema(description = "全市规上工业产值（亿元）")
    val cityScaleIndustrialOutput: BigDecimal?,
    @param:Schema(description = "占全市规上工业比重（%），小数形式")
    val shareOfCityIndustry: BigDecimal?,
    @param:Schema(description = "对规上工业产值增长的贡献率（%），小数形式")
    val contributionToGrowth: BigDecimal?,
    @param:Schema(description = "是否产业链群")
    val isLq: Boolean?,
) {
    fun toProjectDcdxChainClusterPerformance(): ProjectDcdxChainClusterPerformance =
        ProjectDcdxChainClusterPerformance {
            into(this)
        }

    fun into(record: ProjectDcdxChainClusterPerformance): ProjectDcdxChainClusterPerformance {
        record.district = district
        record.park = park
        record.year = year
        record.industrialChainCluster = industrialChainCluster
        record.clusterTotalOutput = clusterTotalOutput
        record.yearOnYearGrowth = yearOnYearGrowth
        record.cityScaleIndustrialOutput = cityScaleIndustrialOutput
        record.shareOfCityIndustry = shareOfCityIndustry
        record.contributionToGrowth = contributionToGrowth
        record.isLq = isLq
        return record
    }
}
