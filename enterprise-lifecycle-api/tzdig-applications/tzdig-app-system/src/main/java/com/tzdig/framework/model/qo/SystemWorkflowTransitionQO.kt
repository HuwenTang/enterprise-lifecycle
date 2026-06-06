package com.tzdig.framework.model.qo

import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowTransitionQO(
    @param:Schema(description = "工作流代码")
    val workflowCode: String? = null,
    @param:Schema(description = "当前节点代码")
    val currentNode: String? = null,
    @param:Schema(description = "通过审批节点代码")
    val resolvedNode: String? = null,
    @param:Schema(description = "驳回审批节点代码")
    val rejectNode: String? = null,
    @param:Schema(description = "角色ID")
    val roleId: String? = null,
)
