package com.tzdig.framework.model.vo

import com.tzdig.framework.core.annotation.JsonDecimal
import io.swagger.v3.oas.annotations.media.Schema

@Suppress("unused")
data class SampleEnterpriseVO(
    @Schema(description = "地区")
    val area: String? = "",
    @Schema(description = "指标名称")
    val name: String = "",
    @Schema(description = "年份")
    val year: Int = 0,
    @Schema(description = "季度")
    val quarter: Int = 1,
    @Schema(description = "样本单位（家）")
    val sampleUnit: Int,
    @Schema(description = "上季度单位数量")
    val lastQuarterUnitNum: Int,
) {
    @get:Schema(description = "单位数量同比")
    @get:JsonDecimal(2)
    val unitNumTb: Float?
        get() = if (lastQuarterUnitNum <= 0) null
        else 100f * (sampleUnit - lastQuarterUnitNum) / lastQuarterUnitNum
}
