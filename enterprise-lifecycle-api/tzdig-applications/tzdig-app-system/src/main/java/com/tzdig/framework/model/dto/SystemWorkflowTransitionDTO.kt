package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.system.SystemWorkflowTransition
import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowTransitionDTO(
    @param:Schema(description = "工作流代码")
    val workflowCode: String?,
    @param:Schema(description = "当前节点代码")
    val currentNode: String?,
    @param:Schema(description = "通过审批节点代码")
    val resolvedNode: String?,
    @param:Schema(description = "驳回审批节点代码")
    val rejectNode: String?,
    @param:Schema(description = "角色ID")
    val roleId: String?,
) {
    fun toSystemWorkflowTransition(): SystemWorkflowTransition =
        SystemWorkflowTransition {
            into(this)
        }

    fun into(record: SystemWorkflowTransition): SystemWorkflowTransition {
        record.workflowCode = workflowCode
        record.currentNode = currentNode
        record.resolvedNode = resolvedNode
        record.rejectNode = rejectNode
        record.roleId = roleId
        return record
    }
}
