@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("lhb_major_project_status", comment = "省重大项目情况统计表")
class LhbMajorProjectStatus() : BaseModel<LhbMajorProjectStatus>() {
    constructor(init: LhbMajorProjectStatus.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市（区）
     */
    @Column("city_district", comment = "市（区）")
    var cityDistrict: String? = null

    /**
     * ① 项目数量
     */
    @Column("project_count", comment = "① 项目数量")
    var projectCount: Int? = null

    /**
     * 计划总投资
     */
    @Column("planned_total_investment", comment = "计划总投资")
    var plannedTotalInvestment: BigDecimal? = null

    /**
     * 年度投资（计划）
     */
    @Column("annual_investment_plan", comment = "年度投资（计划）")
    var annualInvestmentPlan: BigDecimal? = null

    /**
     * 年度投资完成情况-已列统项目数
     */
    @Column("listed_project_count", comment = "年度投资完成情况-已列统项目数")
    var listedProjectCount: Int? = null

    /**
     * ② 实际入库投资
     */
    @Column("actual_invested_amount", comment = "② 实际入库投资")
    var actualInvestedAmount: BigDecimal? = null

    /**
     * ③ ☆投资完成率(%)
     */
    @Column("investment_completion_rate", comment = "③ ☆投资完成率(%)")
    var investmentCompletionRate: BigDecimal? = null

    /**
     * ④ 新开工项目数
     */
    @Column("new_started_project_count", comment = "④ 新开工项目数")
    var newStartedProjectCount: Int? = null

    /**
     * ⑤ 已开工项目数
     */
    @Column("started_project_count", comment = "⑤ 已开工项目数")
    var startedProjectCount: Int? = null

    /**
     * ⑥ 开工率(%)
     */
    @Column("start_rate", comment = "⑥ 开工率(%)")
    var startRate: BigDecimal? = null

    /**
     * 已开工未列统项目数
     */
    @Column("started_unlisted_project_count", comment = "已开工未列统项目数")
    var startedUnlistedProjectCount: Int? = null
}
