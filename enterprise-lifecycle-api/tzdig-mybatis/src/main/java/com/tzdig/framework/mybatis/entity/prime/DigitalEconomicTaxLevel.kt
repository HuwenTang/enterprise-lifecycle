@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("digital_economic_tax_level", comment = "数字经济开票销售分档")
class DigitalEconomicTaxLevel() : BaseModel<DigitalEconomicTaxLevel>() {
    constructor(init: DigitalEconomicTaxLevel.() -> Unit) : this() {
        this.init()
    }

    /**
     * 统一社会信用代码
     */
    @Column("company_code", comment = "统一社会信用代码")
    var companyCode: String? = null

    /**
     * 公司名称
     */
    @Column("company_name", comment = "公司名称")
    var companyName: String? = null

    /**
     * 2025年7月当月开票销售档次
     */
    @Column("level_this_month", comment = "2025年7月当月开票销售档次")
    var levelThisMonth: String? = null

    /**
     * 2025年1-7月开票销售档次
     */
    @Column("level_this_year", comment = "2025年1-7月开票销售档次")
    var levelThisYear: String? = null

    /**
     * 市区
     */
    @Column("district", comment = "市区")
    var district: String? = null
}
