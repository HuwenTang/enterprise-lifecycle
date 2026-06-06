@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("lhb_foreign_investment_projects", comment = "外资利润再投资项目统计表")
class LhbForeignInvestmentProjects() : BaseModel<LhbForeignInvestmentProjects>() {
    constructor(init: LhbForeignInvestmentProjects.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市（区）名称
     */
    @Column("city_district", comment = "市（区）名称")
    var cityDistrict: String? = null

    /**
     * 备案项目总数
     */
    @Column("total_count", comment = "备案项目总数")
    var totalCount: Int? = null

    /**
     * 外资利润再投资项目投资额（万美元）
     */
    @Column("reinvestment_amount_usd", comment = "外资利润再投资项目投资额（万美元）")
    var reinvestmentAmountUsd: BigDecimal? = null

    /**
     * 外资利润再投资项目当月新增数
     */
    @Column("reinvestment_new_monthly", comment = "外资利润再投资项目当月新增数")
    var reinvestmentNewMonthly: Int? = null
}
