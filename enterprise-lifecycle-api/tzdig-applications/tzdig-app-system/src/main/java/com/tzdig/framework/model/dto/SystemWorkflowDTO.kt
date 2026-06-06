package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.system.SystemWorkflow
import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowDTO(
    @param:Schema(description = "工作流代码")
    val code: String?,
    @param:Schema(description = "工作流名称")
    val name: String?,
) {
    fun toSystemWorkflow(): SystemWorkflow =
        SystemWorkflow {
            into(this)
        }

    fun into(record: SystemWorkflow): SystemWorkflow {
        record.code = code
        record.name = name
        return record
    }
}
