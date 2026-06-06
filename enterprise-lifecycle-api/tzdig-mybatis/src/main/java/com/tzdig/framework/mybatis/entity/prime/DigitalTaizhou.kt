@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("digital_taizhou")
class DigitalTaizhou() : BaseModel<DigitalTaizhou>() {
    constructor(init: DigitalTaizhou.() -> Unit) : this() {
        this.init()
    }

    /**
     * 指标大类
     */
    @Column("indicator_category", comment = "指标大类")
    var indicatorCategory: String? = null

    /**
     * 指标小类
     */
    @Column("indicator_subcategory", comment = "指标小类")
    var indicatorSubcategory: String? = null

    /**
     * 年份
     */
    @Column("year", comment = "年份")
    var year: String? = null

    /**
     * 季度
     */
    @Column("quarter", comment = "季度")
    var quarter: String? = null

    /**
     * 累计绝对额
     */
    @Column("cumulative_absolute_amount", comment = "累计绝对额")
    var cumulativeAbsoluteAmount: Double? = null

    /**
     * 期末
     */
    @Column("end_of_period_value", comment = "期末")
    var endOfPeriodValue: String? = null

    /**
     * 单位
     */
    @Column("unit", comment = "单位")
    var unit: String? = null

    /**
     * 累计增幅（%）
     */
    @Column("cumulative_growth_rate", comment = "累计增幅（%）")
    var cumulativeGrowthRate: Double? = null

    @Column("sort", comment = "排序")
    var sort: Int? = null
}
