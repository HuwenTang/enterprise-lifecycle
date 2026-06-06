@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.GdpStatisticalData

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class GdpStatisticalDataExcelRow(
    @field:ExcelProperty("年")
    var year: Int? = null,
    @field:ExcelProperty("地区")
    var area: String? = null,
    @field:ExcelProperty("行业")
    var industry: String? = null,
    @field:ExcelProperty("行业增速数据")
    var industrialGrowthStatistics: Float? = null,
    @field:ExcelProperty("数据记录关联ID")
    var recordId: String? = null,
) : ExcelRow<GdpStatisticalDataExcelRow>() {
    fun toGdpStatisticalData(): GdpStatisticalData =
        GdpStatisticalData {
            into(this)
        }

    fun into(record: GdpStatisticalData): GdpStatisticalData {
        record.year = year
        record.area = area
        record.industry = industry
        record.industrialGrowthStatistics = industrialGrowthStatistics
        record.recordId = recordId
        return record
    }
}
