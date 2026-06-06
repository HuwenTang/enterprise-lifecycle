@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("digital_enterprise_2025_q1", comment = "2025年一季度规模以上数字经济核心产业企业营业收入情况表")
class DigitalEnterprise2025Q1() : BaseModel<DigitalEnterprise2025Q1>() {
    constructor(init: DigitalEnterprise2025Q1.() -> Unit) : this() {
        this.init()
    }

    /**
     * 年
     */
    @Column("year", comment = "年")
    var year: Int? = null

    /**
     * 季度
     */
    @Column("quarter", comment = "季度")
    var quarter: Int? = null

    /**
     * 期数
     */
    @Column("periods", comment = "期数")
    var periods: String? = null

    /**
     * 地区
     */
    @Column("area", comment = "地区")
    var area: String? = null

    /**
     * 合计 
     */
    @Column("total", comment = "合计 ")
    var total: Float? = null

    /**
     * 规上工业
     */
    @Column("digital_top_industry", comment = "规上工业")
    var digitalTopIndustry: Float? = null

    /**
     * 规上建筑业
     */
    @Column("digital_top_construction", comment = "规上建筑业")
    var digitalTopConstruction: Float? = null

    /**
     * 规上批零住餐
     */
    @Column("digital_top_trade", comment = "规上批零住餐")
    var digitalTopTrade: Float? = null

    /**
     * 规上服务业
     */
    @Column("digital_top_service", comment = "规上服务业")
    var digitalTopService: Float? = null

    /**
     * 四上合计
     */
    @Column("up_total", comment = "四上合计")
    var upTotal: Float? = null

    /**
     * 规上工业
     */
    @Column("top_industry", comment = "规上工业")
    var topIndustry: Float? = null

    /**
     * 规上建筑业
     */
    @Column("top_construction", comment = "规上建筑业")
    var topConstruction: Float? = null

    /**
     * 规上批零住餐
     */
    @Column("top_trade", comment = "规上批零住餐")
    var topTrade: Float? = null

    /**
     * 规上服务业
     */
    @Column("top_service", comment = "规上服务业")
    var topService: Float? = null
}
