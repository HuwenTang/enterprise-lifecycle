@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxCompletionInvestment
import java.math.BigDecimal

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectDcdxCompletionInvestmentExcelRow(
    @field:ExcelProperty("市区名称")
    var district: String? = null,
    @field:ExcelProperty("园区名称")
    var park: String? = null,
    @field:ExcelProperty("年份")
    var year: Int? = null,
    @field:ExcelProperty("竣工项目数")
    var completedProjectCount: Int? = null,
    @field:ExcelProperty("签约投资额（万元）")
    var signedInvestment: BigDecimal? = null,
    @field:ExcelProperty("完成投资额（万元）")
    var completedInvestment: BigDecimal? = null,
    @field:ExcelProperty("其中：固定资产投资（万元）")
    var fixedAssetInvestment: BigDecimal? = null,
    @field:ExcelProperty("设备投资（万元）")
    var equipmentInvestment: BigDecimal? = null,
    @field:ExcelProperty("投资完成比重（完成/签约，小数形式）")
    var investmentCompletionRatio: BigDecimal? = null,
    @field:ExcelProperty("所属产业链群")
    var industrialChainCluster: String? = null,
    @field:ExcelProperty("是否产业链群")
    var isLq: Boolean? = null,
) : ExcelRow<ProjectDcdxCompletionInvestmentExcelRow>() {
    fun toProjectDcdxCompletionInvestment(): ProjectDcdxCompletionInvestment =
        ProjectDcdxCompletionInvestment {
            into(this)
        }

    fun into(record: ProjectDcdxCompletionInvestment): ProjectDcdxCompletionInvestment {
        record.district = district
        record.park = park
        record.year = year
        record.completedProjectCount = completedProjectCount
        record.signedInvestment = signedInvestment
        record.completedInvestment = completedInvestment
        record.fixedAssetInvestment = fixedAssetInvestment
        record.equipmentInvestment = equipmentInvestment
        record.investmentCompletionRatio = investmentCompletionRatio
        record.industrialChainCluster = industrialChainCluster
        record.isLq = isLq
        return record
    }
}
