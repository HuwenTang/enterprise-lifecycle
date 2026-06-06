@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("enterprise_expected_revenue_2025")
class EnterpriseExpectedRevenue2025() : BaseModel<EnterpriseExpectedRevenue2025>() {
    constructor(init: EnterpriseExpectedRevenue2025.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市（区）
     */
    @Column("county", comment = "市（区）")
    var county: String? = null

    /**
     * 一季度营收最低目标（亿元）
     */
    @Column("revenue_2025_quarter_1", comment = "一季度营收最低目标（亿元）")
    var revenue2025Quarter1: Float? = null

    /**
     * 二季度营收最低目标（亿元）
     */
    @Column("revenue_2025_quarter_2", comment = "二季度营收最低目标（亿元）")
    var revenue2025Quarter2: Float? = null

    /**
     * 三季度营收最低目标（亿元）
     */
    @Column("revenue_2025_quarter_3", comment = "三季度营收最低目标（亿元）")
    var revenue2025Quarter3: Float? = null

    /**
     * 四季度营收最低目标（亿元）
     */
    @Column("revenue_2025_quarter_4", comment = "四季度营收最低目标（亿元）")
    var revenue2025Quarter4: Float? = null

    /**
     * 挂钩领导
     */
    @Column("leader", comment = "挂钩领导")
    var leader: String? = null

    /**
     * 责任处室
     */
    @Column("department", comment = "责任处室")
    var department: String? = null
}
