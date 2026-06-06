@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.core.annotation.JsonDecimal
import com.tzdig.framework.mybatis.entity.prime.StatIndustryOutput
import io.swagger.v3.oas.annotations.media.Schema

data class StatIndustryOutputVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "年份")
    @ExcelProperty("年份")
    val year: Int?,
    @get:Schema(description = "月份")
    @ExcelProperty("月份")
    val month: Int?,
    @get:Schema(description = "父指标")
    @ExcelProperty("父指标")
    val parentIndicator: String?,
    @get:Schema(description = "指标名称")
    @ExcelProperty("指标名称")
    val indicator: String?,
    @get:JsonDecimal(2)
    @get:Schema(description = "本期")
    @ExcelProperty("本期")
    val current: Float?,
    @get:JsonDecimal(2)
    @get:Schema(description = "同期")
    @ExcelProperty("同期")
    val last: Float?,
    @get:JsonDecimal(2)
    @get:Schema(description = "增长(%)")
    @ExcelProperty("增长(%)")
    val growth: Float?,
    @get:Schema(description = "children")
    val children: MutableList<StatIndustryOutputVO> = mutableListOf(),
) {
    constructor(record: StatIndustryOutput) : this(
        id = record.id,
        year = record.year,
        month = record.month,
        parentIndicator = record.parentIndicator,
        indicator = record.indicator,
        current = record.current,
        last = record.last,
        growth = record.growth,
    )
}
