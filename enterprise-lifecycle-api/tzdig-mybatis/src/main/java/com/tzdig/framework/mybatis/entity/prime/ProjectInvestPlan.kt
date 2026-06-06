@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("project_invest_plan", comment = "项目计划投资情况")
class ProjectInvestPlan() : BaseModel<ProjectInvestPlan>() {
    constructor(init: ProjectInvestPlan.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市区
     */
    @Column("district", comment = "市区")
    var district: String? = null

    /**
     * 项目代码
     */
    @Column("project_code", comment = "项目代码")
    var projectCode: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 年度
     */
    @Column("year", comment = "年度")
    var year: String? = null

    /**
     * 年度计划投资金额
     */
    @Column("plan_invest_amount", comment = "年度计划投资金额")
    var planInvestAmount: BigDecimal? = null

    /**
     * 发改委项目名称
     */
    @Column("fg_project_name", comment = "发改委项目名称")
    var fgProjectName: String? = null

    /**
     * 年度投资
     */
    @Column("plan_total_invest", comment = "年度投资")
    var planTotalInvest: BigDecimal? = null

    /**
     * 是否新开工
     */
    @Column("if_new_build", comment = "是否新开工")
    var ifNewBuild: String? = null
}
