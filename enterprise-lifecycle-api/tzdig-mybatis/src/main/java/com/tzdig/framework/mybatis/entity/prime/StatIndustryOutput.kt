@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("stat_industry_output", comment = "链群产业体系产值")
class StatIndustryOutput() : BaseModel<StatIndustryOutput>() {
    constructor(init: StatIndustryOutput.() -> Unit) : this() {
        this.init()
    }

    /**
     * 年份
     */
    @Column("year", comment = "年份")
    var year: Int? = null

    /**
     * 月份
     */
    @Column("month", comment = "月份")
    var month: Int? = null

    /**
     * 父指标
     */
    @Column("parent_indicator", comment = "父指标")
    var parentIndicator: String? = null

    /**
     * 指标名称
     */
    @Column("indicator", comment = "指标名称")
    var indicator: String? = null

    /**
     * 本期
     */
    @Column("current", comment = "本期")
    var current: Float? = null

    /**
     * 同期
     */
    @Column("last", comment = "同期")
    var last: Float? = null

    /**
     * 增长(%)
     */
    @Column("growth", comment = "增长(%)")
    var growth: Float? = null
}
