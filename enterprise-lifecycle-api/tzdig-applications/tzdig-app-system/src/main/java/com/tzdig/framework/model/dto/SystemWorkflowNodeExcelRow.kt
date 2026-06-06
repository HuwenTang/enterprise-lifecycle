package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowNode

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class SystemWorkflowNodeExcelRow(
    @field:ExcelProperty("工作流代码")
    var workflowCode: String? = null,
    @field:ExcelProperty("节点代码")
    var code: String? = null,
    @field:ExcelProperty("节点名称")
    var name: String? = null,
) : ExcelRow<SystemWorkflowNodeExcelRow>() {
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
