@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("project_dcdx_enterprise_completion_stats", comment = "达产达效-进规纳统企业统计表")
class ProjectDcdxEnterpriseCompletionStats() : BaseModel<ProjectDcdxEnterpriseCompletionStats>() {
    constructor(init: ProjectDcdxEnterpriseCompletionStats.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市（区）名称，如：泰州市、海陵区等
     */
    @Column("city_district", comment = "市（区）名称，如：泰州市、海陵区等")
    var cityDistrict: String? = null

    /**
     * 年份
     */
    @Column("year", comment = "年份")
    var year: Int? = null

    /**
     * 新建竣工项目企业（家）
     */
    @Column("new_completed_enterprises", comment = "新建竣工项目企业（家）")
    var newCompletedEnterprises: Int? = null

    /**
     * 年度可进规企业 - 预估（家）
     */
    @Column("annual_eligible_estimated", comment = "年度可进规企业 - 预估（家）")
    var annualEligibleEstimated: Int? = null

    /**
     * 年度可进规企业 - 预估占比（小数形式）
     */
    @Column("annual_eligible_ratio_estimated", comment = "年度可进规企业 - 预估占比（小数形式）")
    var annualEligibleRatioEstimated: BigDecimal? = null

    /**
     * 已进规企业（实际）（家）
     */
    @Column("actual_in_regulated", comment = "已进规企业（实际）（家）")
    var actualInRegulated: Int? = null

    /**
     * 已进规企业 - 占比（小数形式）
     */
    @Column("actual_in_regulated_ratio", comment = "已进规企业 - 占比（小数形式）")
    var actualInRegulatedRatio: BigDecimal? = null
}
