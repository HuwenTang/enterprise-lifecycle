@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.StatIndustryOutput
import io.swagger.v3.oas.annotations.media.Schema

data class StatIndustryOutputDTO(
    @param:Schema(description = "年份")
    val year: Int?,
    @param:Schema(description = "月份")
    val month: Int?,
    @param:Schema(description = "父指标")
    val parentIndicator: String?,
    @param:Schema(description = "指标名称")
    val indicator: String?,
    @param:Schema(description = "本期")
    val current: Float?,
    @param:Schema(description = "同期")
    val last: Float?,
    @param:Schema(description = "增长(%)")
    val growth: Float?,
) {
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
