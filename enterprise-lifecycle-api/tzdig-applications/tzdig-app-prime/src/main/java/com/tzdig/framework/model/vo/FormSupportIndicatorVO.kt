@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.FormSupportIndicator
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema

data class FormSupportIndicatorVO(
    @Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @Schema(description = "支撑指标名称")
    @ExcelProperty("指标名称")
    val indicatorName: String,
    @Schema(description = "牵头部门ID")
    @ExcelProperty("牵头部门ID")
    val department: String,
    @Schema(description = "支撑指标简介")
    @ExcelProperty("指标简介")
    val description: String?,
) {
    @Schema(description = "牵头部门名称")
    @ExcelProperty("牵头部门名称")
    @get:JsonLabel("collection_dept")
    var departmentName: String? = null
        get() = department
        private set

    constructor(record: FormSupportIndicator) : this(
        id = record.id,
        indicatorName = record.indicatorName!!,
        department = record.department!!,
        description = record.description,
    )
}
