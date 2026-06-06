@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_workflow_node", comment = "工作流节点")
class SystemWorkflowNode() : BaseModel<SystemWorkflowNode>() {
    constructor(init: SystemWorkflowNode.() -> Unit) : this() {
        this.init()
    }

    /**
     * 工作流代码
     */
    @Column("workflow_code", comment = "工作流代码")
    var workflowCode: String? = null

    /**
     * 节点代码
     */
    @Column("code", comment = "节点代码")
    var code: String? = null

    /**
     * 节点名称
     */
    @Column("name", comment = "节点名称")
    var name: String? = null
}
