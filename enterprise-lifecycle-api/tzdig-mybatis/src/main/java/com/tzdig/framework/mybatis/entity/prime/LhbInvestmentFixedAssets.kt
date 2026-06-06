@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("lhb_investment_fixed_assets", comment = "固定资产投资情况统计表")
class LhbInvestmentFixedAssets() : BaseModel<LhbInvestmentFixedAssets>() {
    constructor(init: LhbInvestmentFixedAssets.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市或区的名称
     */
    @Column("region_name", comment = "市或区的名称")
    var regionName: String? = null

    /**
     * 累计完成数值
     */
    @Column("cumulative_amount", comment = "累计完成数值")
    var cumulativeAmount: BigDecimal? = null

    /**
     * 一季度预测数值
     */
    @Column("q1_forecast", comment = "一季度预测数值")
    var q1Forecast: BigDecimal? = null

    /**
     * 一季度完成进度百分比
     */
    @Column("q1_progress_rate", comment = "一季度完成进度百分比")
    var q1ProgressRate: BigDecimal? = null

    /**
     * 全年预测数值
     */
    @Column("annual_forecast", comment = "全年预测数值")
    var annualForecast: BigDecimal? = null

    /**
     * 全年完成进度百分比
     */
    @Column("annual_progress_rate", comment = "全年完成进度百分比")
    var annualProgressRate: BigDecimal? = null
}
