@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("foreign_capital_utilization", comment = "泰州市利用外资情况通报表")
class ForeignCapitalUtilization() : BaseModel<ForeignCapitalUtilization>() {
    constructor(init: ForeignCapitalUtilization.() -> Unit) : this() {
        this.init()
    }

    /**
     * 地区
     */
    @Column("area", comment = "地区")
    var area: String? = null

    /**
     * 新设企业数（当期）
     */
    @Column("new_Enterprise_count_current", comment = "新设企业数（当期）")
    var newEnterpriseCountCurrent: Int? = null

    /**
     * 新设企业数（去年同期）
     */
    @Column("new_Enterprise_count_last_year", comment = "新设企业数（去年同期）")
    var newEnterpriseCountLastYear: Int? = null

    /**
     * 合同外资累计金额
     */
    @Column("contracted_foreign_capital_amount", comment = "合同外资累计金额")
    var contractedForeignCapitalAmount: BigDecimal? = null

    /**
     * 合同外资金额同比
     */
    @Column("contracted_foreign_capital_amount_YoY", comment = "合同外资金额同比")
    var contractedForeignCapitalAmountYoY: String? = null

    /**
     * 合同外资占全市比重
     */
    @Column("contracted_share_in_city_total", comment = "合同外资占全市比重")
    var contractedShareInCityTotal: String? = null

    /**
     * 实际使用外资金额
     */
    @Column("actually_utilized_foreign_capital_amount", comment = "实际使用外资金额")
    var actuallyUtilizedForeignCapitalAmount: BigDecimal? = null

    /**
     * 实际使用外资金额同比
     */
    @Column("actually_utilized_foreign_capital_amount_YoY", comment = "实际使用外资金额同比")
    var actuallyUtilizedForeignCapitalAmountYoY: String? = null

    /**
     * 实际使用外资占全市比重
     */
    @Column("au_share_in_city_total", comment = "实际使用外资占全市比重")
    var auShareInCityTotal: String? = null

    /**
     * 实际使用外资占年度计划比重
     */
    @Column("au_share_in_annual_plan", comment = "实际使用外资占年度计划比重")
    var auShareInAnnualPlan: String? = null

    /**
     * 年
     */
    @Column("year", comment = "年")
    var year: Int? = null

    /**
     * 月份
     */
    @Column("month", comment = "月份")
    var month: Int? = null

    /**
     * 数据记录关联id
     */
    @Column("record_id", comment = "数据记录关联id")
    var recordId: String? = null
}
