@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.StatIndustryOutput

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class StatIndustryOutputExcelRow(
    @field:ExcelProperty("年份")
    var year: Int? = null,
    @field:ExcelProperty("月份")
    var month: Int? = null,
    @field:ExcelProperty("父指标")
    var parentIndicator: String? = null,
    @field:ExcelProperty("指标名称")
    var indicator: String? = null,
    @field:ExcelProperty("本期")
    var current: Float? = null,
    @field:ExcelProperty("同期")
    var last: Float? = null,
    @field:ExcelProperty("增长(%)")
    var growth: Float? = null,
) : ExcelRow<StatIndustryOutputExcelRow>() {
    fun toStatIndustryOutput(): StatIndustryOutput =
        StatIndustryOutput {
            into(this)
        }

    fun into(record: StatIndustryOutput): StatIndustryOutput {
        record.year = year
        record.month = month
        record.parentIndicator = parentIndicator
        record.indicator = indicator
        record.current = current
        record.last = last
        record.growth = growth
        return record
    }
}
