package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.LhbInvestmentFixedAssets
import java.math.BigDecimal

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class LhbInvestmentFixedAssetsExcelRow(
    @field:ExcelProperty("市或区的名称")
    var regionName: String? = null,
    @field:ExcelProperty("累计完成数值")
    var cumulativeAmount: BigDecimal? = null,
    @field:ExcelProperty("一季度预测数值")
    var q1Forecast: BigDecimal? = null,
    @field:ExcelProperty("一季度完成进度百分比")
    var q1ProgressRate: BigDecimal? = null,
    @field:ExcelProperty("全年预测数值")
    var annualForecast: BigDecimal? = null,
    @field:ExcelProperty("全年完成进度百分比")
    var annualProgressRate: BigDecimal? = null,
) : ExcelRow<LhbInvestmentFixedAssetsExcelRow>() {
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
