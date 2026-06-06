@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxChainClusterPerformance
import java.math.BigDecimal

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectDcdxChainClusterPerformanceExcelRow(
    @field:ExcelProperty("市区名称")
    var district: String? = null,
    @field:ExcelProperty("园区名称")
    var park: String? = null,
    @field:ExcelProperty("年份")
    var year: Int? = null,
    @field:ExcelProperty("所属产业链群，如：新能源、生物医药、高端装备等")
    var industrialChainCluster: String? = null,
    @field:ExcelProperty("产业链群合计产值（亿元）")
    var clusterTotalOutput: BigDecimal? = null,
    @field:ExcelProperty("同比增长（%），小数形式（如 0.1234 表示 12.34%）")
    var yearOnYearGrowth: BigDecimal? = null,
    @field:ExcelProperty("全市规上工业产值（亿元）")
    var cityScaleIndustrialOutput: BigDecimal? = null,
    @field:ExcelProperty("占全市规上工业比重（%），小数形式")
    var shareOfCityIndustry: BigDecimal? = null,
    @field:ExcelProperty("对规上工业产值增长的贡献率（%），小数形式")
    var contributionToGrowth: BigDecimal? = null,
    @field:ExcelProperty("是否产业链群")
    var isLq: Boolean? = null,
) : ExcelRow<ProjectDcdxChainClusterPerformanceExcelRow>() {
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
