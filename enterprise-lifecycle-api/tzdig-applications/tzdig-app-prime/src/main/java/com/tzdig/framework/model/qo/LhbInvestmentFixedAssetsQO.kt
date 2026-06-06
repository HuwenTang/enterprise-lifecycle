package com.tzdig.framework.model.qo

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class LhbInvestmentFixedAssetsQO(
    @param:Schema(description = "市或区的名称")
    val regionName: String? = null,
    @param:Schema(description = "累计完成数值")
    val cumulativeAmount: BigDecimal? = null,
    @param:Schema(description = "一季度预测数值")
    val q1Forecast: BigDecimal? = null,
    @param:Schema(description = "一季度完成进度百分比")
    val q1ProgressRate: BigDecimal? = null,
    @param:Schema(description = "全年预测数值")
    val annualForecast: BigDecimal? = null,
    @param:Schema(description = "全年完成进度百分比")
    val annualProgressRate: BigDecimal? = null,
)
