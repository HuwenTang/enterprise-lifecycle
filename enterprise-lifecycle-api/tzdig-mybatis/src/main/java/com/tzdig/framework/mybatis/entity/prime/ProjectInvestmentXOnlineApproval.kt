@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_investment_x_online_approval", comment = "招商项目绑定在线审批")
class ProjectInvestmentXOnlineApproval() : BaseModel<ProjectInvestmentXOnlineApproval>() {
    constructor(init: ProjectInvestmentXOnlineApproval.() -> Unit) : this() {
        this.init()
    }

    @Column(ignore = true)
    override var deleted: Boolean = false

    /**
     * 招商ID
     */
    @Column("investment_id", comment = "招商ID")
    var investmentId: String? = null

    /**
     * 在线审批ID
     */
    @Column("online_approval_id", comment = "在线审批ID")
    var onlineApprovalId: String? = null

    /**
     * 招商ID
     */
    @Column("non_investment_id", comment = "招商ID")
    var nonInvestmentId: String? = null
}
