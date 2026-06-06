package com.tzdig.framework.model.qo

import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowQO(
    @param:Schema(description = "工作流代码")
    val code: String? = null,
    @param:Schema(description = "工作流名称")
    val name: String? = null,
)
