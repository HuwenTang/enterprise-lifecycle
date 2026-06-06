@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.system

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("system_workflow_log", comment = "工作流日志")
class SystemWorkflowLog() : BaseModel<SystemWorkflowLog>() {
    constructor(init: SystemWorkflowLog.() -> Unit) : this() {
        this.init()
    }

    /**
     * 工作流代码
     */
    @Column("workflow_code", comment = "工作流代码")
    var workflowCode: String? = null

    /**
     * 审核记录ID
     */
    @Column("record_id", comment = "审核记录ID")
    var recordId: String? = null

    /**
     * 用户ID
     */
    @Column("userid", comment = "用户ID")
    var userid: String? = null

    /**
     * 用户姓名
     */
    @Column("user_name", comment = "用户姓名")
    var userName: String? = null

    /**
     * 审核结果
     */
    @Column("result", comment = "审核结果")
    var result: Boolean? = null

    /**
     * 审核意见
     */
    @Column("content", comment = "审核意见")
    var content: String? = null

    /**
     * 节点代码
     */
    @Column("node_code", comment = "节点代码")
    var nodeCode: String? = null
}
