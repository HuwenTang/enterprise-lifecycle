@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("quarterly_forecast_2025")
class QuarterlyForecast2025() : BaseModel<QuarterlyForecast2025>() {
    constructor(init: QuarterlyForecast2025.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市（区）
     */
    @Column("city_district", comment = "市（区）")
    var cityDistrict: String? = null

    /**
     * 镇街（园区）
     */
    @Column("town_park", comment = "镇街（园区）")
    var townPark: String? = null

    /**
     * 规上企业数量
     */
    @Column("number_of_large_scale_enterprises", comment = "规上企业数量")
    var numberOfLargeScaleEnterprises: Int? = null

    /**
     * 2025年第一季度产值（亿元）
     */
    @Column("q1_output_value", comment = "2025年第一季度产值（亿元）")
    var q1OutputValue: BigDecimal? = null

    /**
     * 2025年第一季度营业收入（亿元）
     */
    @Column("q1_operating_income", comment = "2025年第一季度营业收入（亿元）")
    var q1OperatingIncome: BigDecimal? = null

    /**
     * 2025年第二季度预期产值（亿元）
     */
    @Column("q2_output_value", comment = "2025年第二季度预期产值（亿元）")
    var q2OutputValue: BigDecimal? = null

    /**
     * 2025年第二季度预期营业收入（亿元）
     */
    @Column("q2_operating_income", comment = "2025年第二季度预期营业收入（亿元）")
    var q2OperatingIncome: BigDecimal? = null

    /**
     * 2025年第三季度预期产值（亿元）
     */
    @Column("q3_output_value", comment = "2025年第三季度预期产值（亿元）")
    var q3OutputValue: BigDecimal? = null

    /**
     * 2025年第三季度预期营业收入（亿元）
     */
    @Column("q3_operating_income", comment = "2025年第三季度预期营业收入（亿元）")
    var q3OperatingIncome: BigDecimal? = null

    /**
     * 2025年第四季度（全年）预期产值（亿元）
     */
    @Column("q4_output_value", comment = "2025年第四季度（全年）预期产值（亿元）")
    var q4OutputValue: BigDecimal? = null

    /**
     * 2025年第四季度（全年）预期营业收入（亿元）
     */
    @Column("q4_operating_income", comment = "2025年第四季度（全年）预期营业收入（亿元）")
    var q4OperatingIncome: BigDecimal? = null

    /**
     * 牵头负责人
     */
    @Column("lead_responsible_person", comment = "牵头负责人")
    var leadResponsiblePerson: String? = null

    /**
     * 具体负责人
     */
    @Column("specific_responsible_person", comment = "具体负责人")
    var specificResponsiblePerson: String? = null
}
