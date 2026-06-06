@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.FormMonitorIndicatorField
import io.swagger.v3.oas.annotations.media.Schema

data class FormMonitorIndicatorFieldDTO(
    @Schema(description = "主键ID")
    val id: String?,
    @Schema(description = "字段名称")
    val fieldName: String,
    @Schema(description = "字段类型")
    val fieldType: String,
    @Schema(description = "字段单位")
    val fieldUnit: String,
    @Schema(description = "是否必填")
    val notNull: Boolean,
    @Schema(description = "排序")
    val sort: Int,
) {
    fun toFormMonitorIndicatorField(monitorIndicatorId: String, id: String? = null): FormMonitorIndicatorField =
        FormMonitorIndicatorField {
            this.id = id
            this.monitorIndicatorId = monitorIndicatorId
            into(this)
        }

    fun into(record: FormMonitorIndicatorField): FormMonitorIndicatorField {
        record.fieldName = fieldName
        record.fieldType = fieldType
        record.fieldUnit = fieldUnit
        record.notNull = notNull
        record.sort = sort
        return record
    }
}
