package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.system.SystemWorkflowNode
import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowNodeDTO(
    @param:Schema(description = "工作流代码")
    val workflowCode: String?,
    @param:Schema(description = "节点代码")
    val code: String?,
    @param:Schema(description = "节点名称")
    val name: String?,
) {
    fun toSystemWorkflowNode(): SystemWorkflowNode =
        SystemWorkflowNode {
            into(this)
        }

    fun into(record: SystemWorkflowNode): SystemWorkflowNode {
        record.workflowCode = workflowCode
        record.code = code
        record.name = name
        return record
    }
}
