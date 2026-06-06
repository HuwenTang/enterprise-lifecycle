@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_online_approval_info")
class ProjectOnlineApprovalInfo() : BaseModel<ProjectOnlineApprovalInfo>() {
    constructor(init: ProjectOnlineApprovalInfo.() -> Unit) : this() {
        this.init()
    }

    /**
     * 在线审批ID
     */
    @Column("online_approval_id", comment = "在线审批ID")
    var onlineApprovalId: String? = null

    /**
     * 行ID
     */
    @Column("row_id", comment = "行ID")
    var rowId: Short? = null

    /**
     * 实施主体
     */
    @Column("implementing_subject", comment = "实施主体")
    var implementingSubject: String? = null

    /**
     * 承办部门
     */
    @Column("undertaking_department", comment = "承办部门")
    var undertakingDepartment: String? = null

    /**
     * 部门区划
     */
    @Column("administrative_division", comment = "部门区划")
    var administrativeDivision: String? = null

    /**
     * 审批事项
     */
    @Column("approval_item", comment = "审批事项")
    var approvalItem: String? = null

    /**
     * 办理状态及时间
     */
    @Column("approval_status", comment = "办理状态及时间")
    var approvalStatus: String? = null
}
