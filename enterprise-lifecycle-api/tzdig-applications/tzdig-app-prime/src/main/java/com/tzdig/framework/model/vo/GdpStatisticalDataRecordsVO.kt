@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.GdpStatisticalDataRecords
import io.swagger.v3.oas.annotations.media.Schema

data class GdpStatisticalDataRecordsVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "统计名称")
    @ExcelProperty("统计名称")
    val statisticsName: String?,
    @get:Schema(description = "年份")
    @ExcelProperty("年份")
    val year: Int?,
    @get:Schema(description = "数据来源")
    @ExcelProperty("数据来源")
    val dataSource: String?,
) {
    constructor(record: GdpStatisticalDataRecords) : this(
        id = record.id,
        statisticsName = record.statisticsName,
        year = record.year,
        dataSource = record.dataSource,
    )
}
