package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.system.SystemWorkflow

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class SystemWorkflowExcelRow(
    @field:ExcelProperty("工作流代码")
    var code: String? = null,
    @field:ExcelProperty("工作流名称")
    var name: String? = null,
) : ExcelRow<SystemWorkflowExcelRow>() {
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
