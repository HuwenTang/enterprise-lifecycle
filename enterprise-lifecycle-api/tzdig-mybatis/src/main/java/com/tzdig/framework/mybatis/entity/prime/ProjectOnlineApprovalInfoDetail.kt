@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDate

@Table("project_online_approval_info_detail")
class ProjectOnlineApprovalInfoDetail() : BaseModel<ProjectOnlineApprovalInfoDetail>() {
    constructor(init: ProjectOnlineApprovalInfoDetail.() -> Unit) : this() {
        this.init()
    }

    /**
     * 在线审批ID
     */
    @Column("online_approval_id", comment = "在线审批ID")
    var onlineApprovalId: String? = null

    /**
     * 在线审批信息ID
     */
    @Column("online_approval_info_id", comment = "在线审批信息ID")
    var onlineApprovalInfoId: String? = null

    /**
     * 办理环节
     */
    @Column("handling_process", comment = "办理环节")
    var handlingProcess: String? = null

    /**
     * 办理日期
     */
    @Column("handling_date", comment = "办理日期")
    var handlingDate: LocalDate? = null

    /**
     * 办理部门
     */
    @Column("handling_department", comment = "办理部门")
    var handlingDepartment: String? = null

    /**
     * 部门区划
     */
    @Column("administrative_division", comment = "部门区划")
    var administrativeDivision: String? = null

    /**
     * 内部办理科室
     */
    @Column("internal_handling_department", comment = "内部办理科室")
    var internalHandlingDepartment: String? = null

    /**
     * 其他办理科室
     */
    @Column("other_handling_department", comment = "其他办理科室")
    var otherHandlingDepartment: String? = null

    /**
     * 备注
     */
    @Column("remark", comment = "备注")
    var remark: String? = null
}
