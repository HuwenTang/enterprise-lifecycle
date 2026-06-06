@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.DigitalTaizhou
import io.swagger.v3.oas.annotations.media.Schema

data class DigitalTaizhouDTO(
    @Schema(description = "指标大类")
    val indicatorCategory: String?,
    @Schema(description = "指标小类")
    val indicatorSubcategory: String?,
    @Schema(description = "年份")
    val year: String?,
    @Schema(description = "季度")
    val quarter: String?,
    @Schema(description = "累计绝对额")
    val cumulativeAbsoluteAmount: Double?,
    @Schema(description = "期末")
    val endOfPeriodValue: String?,
    @Schema(description = "单位")
    val unit: String?,
    @Schema(description = "累计增幅（%）")
    val cumulativeGrowthRate: Double?,
) {
    fun toDigitalTaizhou(): DigitalTaizhou =
        DigitalTaizhou {
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
