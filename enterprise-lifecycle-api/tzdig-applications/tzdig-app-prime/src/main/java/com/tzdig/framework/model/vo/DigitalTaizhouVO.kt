@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.DigitalTaizhou
import io.swagger.v3.oas.annotations.media.Schema

data class DigitalTaizhouVO(
//    @Schema(description = "主键")
//    @ExcelProperty("主键")
//    val id: String?,
//    @Schema(description = "指标大类")
//    @ExcelProperty("指标大类")
//    val indicatorCategory: String?,
//    @Schema(description = "指标小类")
//    @ExcelProperty("指标小类")
//    val indicatorSubcategory: String?,
    @Schema(description = "年份")
    @ExcelProperty("年份")
    val year: String?,
    @Schema(description = "季度")
    @ExcelProperty("季度")
    val quarter: String?,
    @Schema(description = "累计绝对额")
    @ExcelProperty("累计绝对额")
    val cumulativeAbsoluteAmount: Double?,
    @Schema(description = "期末")
    @ExcelProperty("期末")
    val endOfPeriodValue: String?,
    @Schema(description = "单位")
    @ExcelProperty("单位")
    val unit: String?,
    @Schema(description = "累计增幅（%）")
    @ExcelProperty("累计增幅（%）")
    val cumulativeGrowthRate: Double?,
) {
    constructor(record: DigitalTaizhou) : this(
//        id = record.id,
//        indicatorCategory = record.indicatorCategory,
//        indicatorSubcategory = record.indicatorSubcategory,
        year = record.year,
        quarter = record.quarter,
        cumulativeAbsoluteAmount = record.cumulativeAbsoluteAmount,
        endOfPeriodValue = record.endOfPeriodValue,
        unit = record.unit,
        cumulativeGrowthRate = record.cumulativeGrowthRate,
    )
}
