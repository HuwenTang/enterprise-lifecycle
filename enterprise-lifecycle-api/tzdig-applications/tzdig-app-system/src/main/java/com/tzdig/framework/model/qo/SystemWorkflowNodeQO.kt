package com.tzdig.framework.model.qo

import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowNodeQO(
    @param:Schema(description = "工作流代码")
    val workflowCode: String? = null,
    @param:Schema(description = "节点代码")
    val code: String? = null,
    @param:Schema(description = "节点名称")
    val name: String? = null,
)
