@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("enterprise_economic_info")
class EnterpriseEconomicInfo() : BaseModel<EnterpriseEconomicInfo>() {
    constructor(init: EnterpriseEconomicInfo.() -> Unit) : this() {
        this.init()
    }

    /**
     * 单位名称
     */
    @Column("company_name", comment = "单位名称")
    var companyName: String? = null

    /**
     * 2023年产值
     */
    @Column("output_year_2023", comment = "2023年产值")
    var outputYear2023: Float? = null

    /**
     * 2024年产值
     */
    @Column("output_year_2024", comment = "2024年产值")
    var outputYear2024: Float? = null

    /**
     * 2025年产值
     */
    @Column("output_year_2025", comment = "2025年产值")
    var outputYear2025: Float? = null

    /**
     * 2025年一季度产值
     */
    @Column("output_quarter_2025_1", comment = "2025年一季度产值")
    var outputQuarter20251: Float? = null

    /**
     * 2025年二季度产值
     */
    @Column("output_quarter_2025_2", comment = "2025年二季度产值")
    var outputQuarter20252: Float? = null

    /**
     * 2025年三季度产值
     */
    @Column("output_quarter_2025_3", comment = "2025年三季度产值")
    var outputQuarter20253: Float? = null

    /**
     * 2025年四季度产值
     */
    @Column("output_quarter_2025_4", comment = "2025年四季度产值")
    var outputQuarter20254: Float? = null

    /**
     * 2023年一季度营收
     */
    @Column("revenue_2023_quarter_1", comment = "2023年一季度营收")
    var revenue2023Quarter1: Float? = null

    /**
     * 2023年二季度营收
     */
    @Column("revenue_2023_quarter_2", comment = "2023年二季度营收")
    var revenue2023Quarter2: Float? = null

    /**
     * 2023年三季度营收
     */
    @Column("revenue_2023_quarter_3", comment = "2023年三季度营收")
    var revenue2023Quarter3: Float? = null

    /**
     * 2023年四季度营收
     */
    @Column("revenue_2023_quarter_4", comment = "2023年四季度营收")
    var revenue2023Quarter4: Float? = null

    /**
     * 2024年一季度营收
     */
    @Column("revenue_2024_quarter_1", comment = "2024年一季度营收")
    var revenue2024Quarter1: Float? = null

    /**
     * 2024年二季度营收
     */
    @Column("revenue_2024_quarter_2", comment = "2024年二季度营收")
    var revenue2024Quarter2: Float? = null

    /**
     * 2024年三季度营收
     */
    @Column("revenue_2024_quarter_3", comment = "2024年三季度营收")
    var revenue2024Quarter3: Float? = null

    /**
     * 2024年四季度营收
     */
    @Column("revenue_2024_quarter_4", comment = "2024年四季度营收")
    var revenue2024Quarter4: Float? = null

    /**
     * 2025年一季度营收
     */
    @Column("revenue_2025_quarter_1", comment = "2025年一季度营收")
    var revenue2025Quarter1: Float? = null

    /**
     * 2025年二季度营收
     */
    @Column("revenue_2025_quarter_2", comment = "2025年二季度营收")
    var revenue2025Quarter2: Float? = null

    /**
     * 2025年三季度营收
     */
    @Column("revenue_2025_quarter_3", comment = "2025年三季度营收")
    var revenue2025Quarter3: Float? = null

    /**
     * 2025年四季度营收
     */
    @Column("revenue_2025_quarter_4", comment = "2025年四季度营收")
    var revenue2025Quarter4: Float? = null
}
