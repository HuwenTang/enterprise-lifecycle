@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDate

@Table("project_fagai_statical_info", comment = "全市新增入库项目情况表（表一）")
class ProjectFagaiStaticalInfo() : BaseModel<ProjectFagaiStaticalInfo>() {
    constructor(init: ProjectFagaiStaticalInfo.() -> Unit) : this() {
        this.init()
    }

    /**
     * 投资入库时间
     */
    @Column("entry_date", comment = "投资入库时间")
    var entryDate: LocalDate? = null

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
     * 计划总投资（万元）
     */
    @Column("planned_total_investment", comment = "计划总投资（万元）")
    var plannedTotalInvestment: Double? = null
}
