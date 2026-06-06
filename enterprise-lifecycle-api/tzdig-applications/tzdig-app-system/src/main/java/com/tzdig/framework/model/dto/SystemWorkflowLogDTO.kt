package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.system.SystemWorkflowLog
import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowLogDTO(
    @param:Schema(description = "工作流代码")
    val workflowCode: String?,
    @param:Schema(description = "审核记录ID")
    val recordId: String?,
    @param:Schema(description = "用户ID")
    val userid: String?,
    @param:Schema(description = "用户姓名")
    val userName: String?,
    @param:Schema(description = "审核结果")
    val result: Boolean?,
    @param:Schema(description = "审核意见")
    val content: String?,
    @param:Schema(description = "节点代码")
    val nodeCode: String?,
) {
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
