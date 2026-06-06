package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.system.SystemWorkflow
import io.swagger.v3.oas.annotations.media.Schema

data class SystemWorkflowVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "工作流代码")
    @ExcelProperty("工作流代码")
    val code: String?,
    @get:Schema(description = "工作流名称")
    @ExcelProperty("工作流名称")
    val name: String?,
) {
    constructor(record: SystemWorkflow) : this(
        id = record.id,
        code = record.code,
        name = record.name,
    )
}
