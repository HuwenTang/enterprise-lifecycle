@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelIgnore
import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.FormMonitorIndicatorField
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema

data class FormMonitorIndicatorFieldVO(
    @Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @Schema(description = "监测指标ID")
    @ExcelProperty("监测指标ID")
    val monitorIndicatorId: String,
    @Schema(description = "字段名称")
    @ExcelProperty("字段名称")
    val fieldName: String,
    @Schema(description = "字段类型")
    @ExcelIgnore
    val fieldType: String,
    @Schema(description = "字段单位")
    @ExcelProperty("字段单位")
    val fieldUnit: String,
    @Schema(description = "是否必填")
    @ExcelProperty("是否必填")
    val notNull: Boolean,
    @Schema(description = "排序")
    @ExcelProperty("排序")
    val sort: Int,
) {
    @Schema(description = "字段类型")
    @ExcelProperty("字段类型")
    @get:JsonLabel("field_type")
    var fieldTypeLabel: String? = null
        get() = fieldType
        private set

    constructor(record: FormMonitorIndicatorField) : this(
        id = record.id,
        monitorIndicatorId = record.monitorIndicatorId!!,
        fieldName = record.fieldName!!,
        fieldType = record.fieldType!!,
        fieldUnit = record.fieldUnit!!,
        notNull = record.notNull!!,
        sort = record.sort!!,
    )
}
