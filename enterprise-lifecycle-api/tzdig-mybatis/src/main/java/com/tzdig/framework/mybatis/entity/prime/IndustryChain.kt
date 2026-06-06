@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("industry_chain")
class IndustryChain() : BaseModel<IndustryChain>() {
    constructor(init: IndustryChain.() -> Unit) : this() {
        this.init()
    }

    /**
     * 产业集群分类
     */
    @Column("cluster", comment = "产业集群分类")
    var cluster: String? = null

    /**
     * 所属产业链
     */
    @Column("chains", comment = "所属产业链")
    var chains: String? = null

    /**
     * 企业数量
     */
    @Column("company_number", comment = "企业数量")
    var companyNumber: Int? = null

    /**
     * 本期产值
     */
    @Column("output", comment = "本期产值")
    var output: Float? = null

    /**
     * 产值增长 （%）
     */
    @Column("output_increment", comment = "产值增长 （%）")
    var outputIncrement: Float? = null

    /**
     * 本期营收（亿元）
     */
    @Column("revenue", comment = "本期营收（亿元）")
    var revenue: Float? = null

    /**
     * 营收增长(%)
     */
    @Column("revenue_increment", comment = "营收增长(%)")
    var revenueIncrement: Float? = null

    /**
     * 本期利润
     */
    @Column("profit", comment = "本期利润")
    var profit: Float? = null

    /**
     * 利润增长（%）
     */
    @Column("profit_increment", comment = "利润增长（%）")
    var profitIncrement: Float? = null
}
