package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.LhbInvestmentFixedAssets
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class LhbInvestmentFixedAssetsDTO(
    @param:Schema(description = "市或区的名称")
    val regionName: String?,
    @param:Schema(description = "累计完成数值")
    val cumulativeAmount: BigDecimal?,
    @param:Schema(description = "一季度预测数值")
    val q1Forecast: BigDecimal?,
    @param:Schema(description = "一季度完成进度百分比")
    val q1ProgressRate: BigDecimal?,
    @param:Schema(description = "全年预测数值")
    val annualForecast: BigDecimal?,
    @param:Schema(description = "全年完成进度百分比")
    val annualProgressRate: BigDecimal?,
) {
    fun toLhbInvestmentFixedAssets(): LhbInvestmentFixedAssets =
        LhbInvestmentFixedAssets {
            into(this)
        }

    fun into(record: LhbInvestmentFixedAssets): LhbInvestmentFixedAssets {
        record.regionName = regionName
        record.cumulativeAmount = cumulativeAmount
        record.q1Forecast = q1Forecast
        record.q1ProgressRate = q1ProgressRate
        record.annualForecast = annualForecast
        record.annualProgressRate = annualProgressRate
        return record
    }
}
