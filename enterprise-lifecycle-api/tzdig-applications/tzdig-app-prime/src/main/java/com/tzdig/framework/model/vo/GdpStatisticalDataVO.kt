@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.GdpStatisticalData
import io.swagger.v3.oas.annotations.media.Schema

data class GdpStatisticalDataVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "年")
    @ExcelProperty("年")
    val year: Int?,
    @get:Schema(description = "地区")
    @ExcelProperty("地区")
    val area: String?,
    @get:Schema(description = "行业")
    @ExcelProperty("行业")
    val industry: String?,
    @get:Schema(description = "行业增速数据")
    @ExcelProperty("行业增速数据")
    val industrialGrowthStatistics: Float?,
    @get:Schema(description = "数据记录关联ID")
    @ExcelProperty("数据记录关联ID")
    val recordId: String?,
) {
    constructor(record: GdpStatisticalData) : this(
        id = record.id,
        year = record.year,
        area = record.area,
        industry = record.industry,
        industrialGrowthStatistics = record.industrialGrowthStatistics,
        recordId = record.recordId,
    )
}
