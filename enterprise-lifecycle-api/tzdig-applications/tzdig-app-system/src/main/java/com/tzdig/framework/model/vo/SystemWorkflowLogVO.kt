package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowLog
import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowLogVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "工作流代码")
    @ExcelProperty("工作流代码")
    val workflowCode: String?,
    @get:Schema(description = "审核记录ID")
    @ExcelProperty("审核记录ID")
    val recordId: String?,
    @get:Schema(description = "用户ID")
    @ExcelProperty("用户ID")
    val userid: String?,
    @get:Schema(description = "用户姓名")
    @ExcelProperty("用户姓名")
    val userName: String?,
    @get:Schema(description = "审核结果")
    @ExcelProperty("审核结果")
    val result: Boolean?,
    @get:Schema(description = "审核意见")
    @ExcelProperty("审核意见")
    val content: String?,
    @get:Schema(description = "节点代码")
    @ExcelProperty("节点代码")
    val nodeCode: String?,
) {
    constructor(record: SystemWorkflowLog) : this(
        id = record.id,
        workflowCode = record.workflowCode,
        recordId = record.recordId,
        userid = record.userid,
        userName = record.userName,
        result = record.result,
        content = record.content,
        nodeCode = record.nodeCode,
    )
}
