@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxCompletionInvestment
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectDcdxCompletionInvestmentVO(
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
    @get:Schema(description = "竣工项目数")
    @ExcelProperty("竣工项目数")
    val completedProjectCount: Int?,
    @get:Schema(description = "签约投资额（万元）")
    @ExcelProperty("签约投资额（万元）")
    val signedInvestment: BigDecimal?,
    @get:Schema(description = "完成投资额（万元）")
    @ExcelProperty("完成投资额（万元）")
    val completedInvestment: BigDecimal?,
    @get:Schema(description = "其中：固定资产投资（万元）")
    @ExcelProperty("其中：固定资产投资（万元）")
    val fixedAssetInvestment: BigDecimal?,
    @get:Schema(description = "设备投资（万元）")
    @ExcelProperty("设备投资（万元）")
    val equipmentInvestment: BigDecimal?,
    @get:Schema(description = "投资完成比重（完成/签约，小数形式）")
    @ExcelProperty("投资完成比重（完成/签约，小数形式）")
    val investmentCompletionRatio: BigDecimal?,
    @get:Schema(description = "所属产业链群")
    @ExcelProperty("所属产业链群")
    val industrialChainCluster: String?,
    @get:Schema(description = "是否产业链群")
    @ExcelProperty("是否产业链群")
    val isLq: Boolean?,
    @get:Schema(description = "children")
    val children: MutableList<ProjectDcdxCompletionInvestmentVO> = mutableListOf()
) {
    constructor(record: ProjectDcdxCompletionInvestment) : this(
        id = record.id,
        district = record.district,
        park = record.park,
        year = record.year,
        completedProjectCount = record.completedProjectCount,
        signedInvestment = record.signedInvestment,
        completedInvestment = record.completedInvestment,
        fixedAssetInvestment = record.fixedAssetInvestment,
        equipmentInvestment = record.equipmentInvestment,
        investmentCompletionRatio = record.investmentCompletionRatio,
        industrialChainCluster = record.industrialChainCluster,
        isLq = record.isLq,
    )
}
