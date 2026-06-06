@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDate

@Table("project_fagai_statical_investment", comment = "全市项目列统情况表（表二）")
class ProjectFagaiStaticalInvestment() : BaseModel<ProjectFagaiStaticalInvestment>() {
    constructor(init: ProjectFagaiStaticalInvestment.() -> Unit) : this() {
        this.init()
    }

    /**
     * 年月
     */
    @Column("year_and_month", comment = "年月")
    var yearAndMonth: LocalDate? = null

    /**
     * 市（区）
     */
    @Column("district", comment = "市（区）")
    var district: String? = null

    /**
     * 管理级别
     */
    @Column("administration_level", comment = "管理级别")
    var administrationLevel: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 投资项目在线审批监管平台
     */
    @Column("online_approval_code", comment = "投资项目在线审批监管平台")
    var onlineApprovalCode: String? = null

    /**
     * 项目（法人）码
     */
    @Column("project_code", comment = "项目（法人）码")
    var projectCode: String? = null

    /**
     * 计划总投资
     */
    @Column("planned_total_investment", comment = "计划总投资")
    var plannedTotalInvestment: Double? = null

    /**
     * 自开始建设至本年底累计完成投资(或自开始建设累计完成投资)
     */
    @Column("actual_total_investment", comment = "自开始建设至本年底累计完成投资(或自开始建设累计完成投资)")
    var actualTotalInvestment: Double? = null

    /**
     * 本年完成投资(或自年初累计完成投资)
     */
    @Column("actual_year_investment", comment = "本年完成投资(或自年初累计完成投资)")
    var actualYearInvestment: Double? = null

    /**
     * 其中本月完成投资
     */
    @Column("actual_month_investment", comment = "其中本月完成投资")
    var actualMonthInvestment: Double? = null
}
