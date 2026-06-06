@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEnterpriseCompletionStats
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectDcdxEnterpriseCompletionStatsVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "市（区）名称，如：泰州市、海陵区等")
    @ExcelProperty("市（区）名称，如：泰州市、海陵区等")
    val cityDistrict: String?,
    @get:Schema(description = "年份")
    @ExcelProperty("年份")
    val year: Int?,
    @get:Schema(description = "新建竣工项目企业（家）")
    @ExcelProperty("新建竣工项目企业（家）")
    val newCompletedEnterprises: Int?,
    @get:Schema(description = "年度可进规企业 - 预估（家）")
    @ExcelProperty("年度可进规企业 - 预估（家）")
    val annualEligibleEstimated: Int?,
    @get:Schema(description = "年度可进规企业 - 预估占比（小数形式）")
    @ExcelProperty("年度可进规企业 - 预估占比（小数形式）")
    val annualEligibleRatioEstimated: BigDecimal?,
    @get:Schema(description = "已进规企业（实际）（家）")
    @ExcelProperty("已进规企业（实际）（家）")
    val actualInRegulated: Int?,
    @get:Schema(description = "已进规企业 - 占比（小数形式）")
    @ExcelProperty("已进规企业 - 占比（小数形式）")
    val actualInRegulatedRatio: BigDecimal?,
) {
    constructor(record: ProjectDcdxEnterpriseCompletionStats) : this(
        id = record.id,
        cityDistrict = record.cityDistrict,
        year = record.year,
        newCompletedEnterprises = record.newCompletedEnterprises,
        annualEligibleEstimated = record.annualEligibleEstimated,
        annualEligibleRatioEstimated = record.annualEligibleRatioEstimated,
        actualInRegulated = record.actualInRegulated,
        actualInRegulatedRatio = record.actualInRegulatedRatio,
    )
}
