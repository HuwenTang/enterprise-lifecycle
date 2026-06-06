package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowTransition

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class SystemWorkflowTransitionExcelRow(
    @field:ExcelProperty("工作流代码")
    var workflowCode: String? = null,
    @field:ExcelProperty("当前节点代码")
    var currentNode: String? = null,
    @field:ExcelProperty("通过审批节点代码")
    var resolvedNode: String? = null,
    @field:ExcelProperty("驳回审批节点代码")
    var rejectNode: String? = null,
    @field:ExcelProperty("角色ID")
    var roleId: String? = null,
) : ExcelRow<SystemWorkflowTransitionExcelRow>() {
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
