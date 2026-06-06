@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.DigitalTaizhou

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class DigitalTaizhouExcelRow(
    @ExcelProperty("指标大类")
    var indicatorCategory: String? = null,
    @ExcelProperty("指标小类")
    var indicatorSubcategory: String? = null,
    @ExcelProperty("年份")
    var year: String? = null,
    @ExcelProperty("季度")
    var quarter: String? = null,
    @ExcelProperty("累计绝对额")
    var cumulativeAbsoluteAmount: Double? = null,
    @ExcelProperty("期末")
    var endOfPeriodValue: String? = null,
    @ExcelProperty("单位")
    var unit: String? = null,
    @ExcelProperty("累计增幅（%）")
    var cumulativeGrowthRate: Double? = null,
) : ExcelRow<DigitalTaizhouExcelRow>() {
    fun toDigitalTaizhou(): DigitalTaizhou =
        with(DigitalTaizhou()) {
            into(this)
        }

    fun into(record: DigitalTaizhou): DigitalTaizhou {
        record.indicatorCategory = indicatorCategory
        record.indicatorSubcategory = indicatorSubcategory
        record.year = year
        record.quarter = quarter
        record.cumulativeAbsoluteAmount = cumulativeAbsoluteAmount
        record.endOfPeriodValue = endOfPeriodValue
        record.unit = unit
        record.cumulativeGrowthRate = cumulativeGrowthRate
        return record
    }
}
