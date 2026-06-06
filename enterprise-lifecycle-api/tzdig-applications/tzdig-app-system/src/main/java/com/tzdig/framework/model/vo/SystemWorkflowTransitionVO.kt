package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowTransition
import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowTransitionVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "工作流代码")
    @ExcelProperty("工作流代码")
    val workflowCode: String?,
    @get:Schema(description = "当前节点代码")
    @ExcelProperty("当前节点代码")
    val currentNode: String?,
    @get:Schema(description = "通过审批节点代码")
    @ExcelProperty("通过审批节点代码")
    val resolvedNode: String?,
    @get:Schema(description = "驳回审批节点代码")
    @ExcelProperty("驳回审批节点代码")
    val rejectNode: String?,
    @get:Schema(description = "角色ID")
    @ExcelProperty("角色ID")
    val roleId: String?,
) {
    constructor(record: SystemWorkflowTransition) : this(
        id = record.id,
        workflowCode = record.workflowCode,
        currentNode = record.currentNode,
        resolvedNode = record.resolvedNode,
        rejectNode = record.rejectNode,
        roleId = record.roleId,
    )
}
