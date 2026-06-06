@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.GdpStatisticalData
import io.swagger.v3.oas.annotations.media.Schema

data class GdpStatisticalDataDTO(
    @get:Schema(description = "年")
    val year: Int?,
    @get:Schema(description = "地区")
    val area: String?,
    @get:Schema(description = "行业")
    val industry: String?,
    @get:Schema(description = "行业增速数据")
    val industrialGrowthStatistics: Float?,
    @get:Schema(description = "数据记录关联ID")
    val recordId: String?,
) {
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
