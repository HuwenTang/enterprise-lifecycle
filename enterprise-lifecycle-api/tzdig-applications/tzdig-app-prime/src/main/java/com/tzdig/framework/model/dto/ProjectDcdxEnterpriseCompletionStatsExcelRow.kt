@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEnterpriseCompletionStats
import java.math.BigDecimal

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectDcdxEnterpriseCompletionStatsExcelRow(
    @field:ExcelProperty("市（区）名称，如：泰州市、海陵区等")
    var cityDistrict: String? = null,
    @field:ExcelProperty("年份")
    var year: Int? = null,
    @field:ExcelProperty("新建竣工项目企业（家）")
    var newCompletedEnterprises: Int? = null,
    @field:ExcelProperty("年度可进规企业 - 预估（家）")
    var annualEligibleEstimated: Int? = null,
    @field:ExcelProperty("年度可进规企业 - 预估占比（小数形式）")
    var annualEligibleRatioEstimated: BigDecimal? = null,
    @field:ExcelProperty("已进规企业（实际）（家）")
    var actualInRegulated: Int? = null,
    @field:ExcelProperty("已进规企业 - 占比（小数形式）")
    var actualInRegulatedRatio: BigDecimal? = null,
) : ExcelRow<ProjectDcdxEnterpriseCompletionStatsExcelRow>() {
    fun toProjectDcdxEnterpriseCompletionStats(): ProjectDcdxEnterpriseCompletionStats =
        ProjectDcdxEnterpriseCompletionStats {
            into(this)
        }

    fun into(record: ProjectDcdxEnterpriseCompletionStats): ProjectDcdxEnterpriseCompletionStats {
        record.cityDistrict = cityDistrict
        record.year = year
        record.newCompletedEnterprises = newCompletedEnterprises
        record.annualEligibleEstimated = annualEligibleEstimated
        record.annualEligibleRatioEstimated = annualEligibleRatioEstimated
        record.actualInRegulated = actualInRegulated
        record.actualInRegulatedRatio = actualInRegulatedRatio
        return record
    }
}
