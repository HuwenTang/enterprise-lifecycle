@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxChainClusterPerformance
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectDcdxChainClusterPerformanceVO(
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
    @get:Schema(description = "所属产业链群，如：新能源、生物医药、高端装备等")
    @ExcelProperty("所属产业链群，如：新能源、生物医药、高端装备等")
    val industrialChainCluster: String?,
    @get:Schema(description = "产业链群合计产值（亿元）")
    @ExcelProperty("产业链群合计产值（亿元）")
    val clusterTotalOutput: BigDecimal?,
    @get:Schema(description = "同比增长（%），小数形式（如 0.1234 表示 12.34%）")
    @ExcelProperty("同比增长（%），小数形式（如 0.1234 表示 12.34%）")
    val yearOnYearGrowth: BigDecimal?,
    @get:Schema(description = "全市规上工业产值（亿元）")
    @ExcelProperty("全市规上工业产值（亿元）")
    val cityScaleIndustrialOutput: BigDecimal?,
    @get:Schema(description = "占全市规上工业比重（%），小数形式")
    @ExcelProperty("占全市规上工业比重（%），小数形式")
    val shareOfCityIndustry: BigDecimal?,
    @get:Schema(description = "对规上工业产值增长的贡献率（%），小数形式")
    @ExcelProperty("对规上工业产值增长的贡献率（%），小数形式")
    val contributionToGrowth: BigDecimal?,
    @get:Schema(description = "是否产业链群")
    @ExcelProperty("是否产业链群")
    val isLq: Boolean?,
) {
    constructor(record: ProjectDcdxChainClusterPerformance) : this(
        id = record.id,
        district = record.district,
        park = record.park,
        year = record.year,
        industrialChainCluster = record.industrialChainCluster,
        clusterTotalOutput = record.clusterTotalOutput,
        yearOnYearGrowth = record.yearOnYearGrowth,
        cityScaleIndustrialOutput = record.cityScaleIndustrialOutput,
        shareOfCityIndustry = record.shareOfCityIndustry,
        contributionToGrowth = record.contributionToGrowth,
        isLq = record.isLq,
    )
}
