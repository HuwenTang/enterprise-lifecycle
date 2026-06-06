package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.LhbInvestmentFixedAssets
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class LhbInvestmentFixedAssetsVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "市或区的名称")
    @ExcelProperty("市或区的名称")
    val regionName: String?,
    @get:Schema(description = "累计完成数值")
    @ExcelProperty("累计完成数值")
    val cumulativeAmount: BigDecimal?,
    @get:Schema(description = "一季度预测数值")
    @ExcelProperty("一季度预测数值")
    val q1Forecast: BigDecimal?,
    @get:Schema(description = "一季度完成进度百分比")
    @ExcelProperty("一季度完成进度百分比")
    val q1ProgressRate: BigDecimal?,
    @get:Schema(description = "全年预测数值")
    @ExcelProperty("全年预测数值")
    val annualForecast: BigDecimal?,
    @get:Schema(description = "全年完成进度百分比")
    @ExcelProperty("全年完成进度百分比")
    val annualProgressRate: BigDecimal?,
) {
    constructor(record: LhbInvestmentFixedAssets) : this(
        id = record.id,
        regionName = record.regionName,
        cumulativeAmount = record.cumulativeAmount,
        q1Forecast = record.q1Forecast,
        q1ProgressRate = record.q1ProgressRate,
        annualForecast = record.annualForecast,
        annualProgressRate = record.annualProgressRate,
    )
}
