@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.GdpStatisticalDataRecords

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class GdpStatisticalDataRecordsExcelRow(
    @field:ExcelProperty("统计名称")
    var statisticsName: String? = null,
    @field:ExcelProperty("年份")
    var year: Int? = null,
    @field:ExcelProperty("数据来源")
    var dataSource: String? = null,
) : ExcelRow<GdpStatisticalDataRecordsExcelRow>() {
    fun toGdpStatisticalDataRecords(): GdpStatisticalDataRecords =
        GdpStatisticalDataRecords {
            into(this)
        }

    fun into(record: GdpStatisticalDataRecords): GdpStatisticalDataRecords {
        record.statisticsName = statisticsName
        record.year = year
        record.dataSource = dataSource
        return record
    }
}
