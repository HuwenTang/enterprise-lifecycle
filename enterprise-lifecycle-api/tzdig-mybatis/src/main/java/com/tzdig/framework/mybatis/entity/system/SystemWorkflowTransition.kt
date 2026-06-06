@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_workflow_transition", comment = "工作流流转配置")
class SystemWorkflowTransition() : BaseModel<SystemWorkflowTransition>() {
    constructor(init: SystemWorkflowTransition.() -> Unit) : this() {
        this.init()
    }

    /**
     * 工作流代码
     */
    @Column("workflow_code", comment = "工作流代码")
    var workflowCode: String? = null

    /**
     * 当前节点代码
     */
    @Column("current_node", comment = "当前节点代码")
    var currentNode: String? = null

    /**
     * 通过审批节点代码
     */
    @Column("resolved_node", comment = "通过审批节点代码")
    var resolvedNode: String? = null

    /**
     * 驳回审批节点代码
     */
    @Column("reject_node", comment = "驳回审批节点代码")
    var rejectNode: String? = null

    /**
     * 角色ID
     */
    @Column("role_id", comment = "角色ID")
    var roleId: String? = null
}
