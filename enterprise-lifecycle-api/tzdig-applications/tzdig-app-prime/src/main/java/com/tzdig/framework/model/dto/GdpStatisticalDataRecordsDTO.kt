@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.GdpStatisticalDataRecords
import io.swagger.v3.oas.annotations.media.Schema

data class GdpStatisticalDataRecordsDTO(
    @get:Schema(description = "统计名称")
    val statisticsName: String?,
    @get:Schema(description = "年份")
    val year: Int?,
    @get:Schema(description = "数据来源")
    val dataSource: String?,
) {
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
