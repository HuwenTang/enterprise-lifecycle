package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowLog

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class SystemWorkflowLogExcelRow(
    @field:ExcelProperty("工作流代码")
    var workflowCode: String? = null,
    @field:ExcelProperty("审核记录ID")
    var recordId: String? = null,
    @field:ExcelProperty("用户ID")
    var userid: String? = null,
    @field:ExcelProperty("用户姓名")
    var userName: String? = null,
    @field:ExcelProperty("审核结果")
    var result: Boolean? = null,
    @field:ExcelProperty("审核意见")
    var content: String? = null,
    @field:ExcelProperty("节点代码")
    var nodeCode: String? = null,
) : ExcelRow<SystemWorkflowLogExcelRow>() {
    fun toSystemWorkflowLog(): SystemWorkflowLog =
        SystemWorkflowLog {
            into(this)
        }

    fun into(record: SystemWorkflowLog): SystemWorkflowLog {
        record.workflowCode = workflowCode
        record.recordId = recordId
        record.userid = userid
        record.userName = userName
        record.result = result
        record.content = content
        record.nodeCode = nodeCode
        return record
    }
}
