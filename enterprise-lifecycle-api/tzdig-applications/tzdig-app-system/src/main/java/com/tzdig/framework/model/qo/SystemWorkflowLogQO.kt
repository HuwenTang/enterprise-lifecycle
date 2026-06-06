package com.tzdig.framework.model.qo

import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowLogQO(
    @param:Schema(description = "工作流代码")
    val workflowCode: String? = null,
    @param:Schema(description = "审核记录ID")
    val recordId: String? = null,
    @param:Schema(description = "用户ID")
    val userid: String? = null,
    @param:Schema(description = "用户姓名")
    val userName: String? = null,
    @param:Schema(description = "审核结果")
    val result: Boolean? = null,
    @param:Schema(description = "审核意见")
    val content: String? = null,
    @param:Schema(description = "节点代码")
    val nodeCode: String? = null,
)
