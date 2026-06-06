package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowNode
import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowNodeVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "工作流代码")
    @ExcelProperty("工作流代码")
    val workflowCode: String?,
    @get:Schema(description = "节点代码")
    @ExcelProperty("节点代码")
    val code: String?,
    @get:Schema(description = "节点名称")
    @ExcelProperty("节点名称")
    val name: String?,
) {
    constructor(record: SystemWorkflowNode) : this(
        id = record.id,
        workflowCode = record.workflowCode,
        code = record.code,
        name = record.name,
    )
}
