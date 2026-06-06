@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.FormSupportIndicator
import io.swagger.v3.oas.annotations.media.Schema

data class FormSupportIndicatorDTO(
    @Schema(description = "支撑指标名称")
    val indicatorName: String,
    @Schema(description = "牵头部门ID")
    val department: String,
    @Schema(description = "支撑指标简介")
    val description: String?,
) {
    fun toFormSupportIndicator(): FormSupportIndicator =
        FormSupportIndicator {
            into(this)
        }

    fun into(record: FormSupportIndicator): FormSupportIndicator {
        record.indicatorName = indicatorName
        record.department = department
        record.description = description
        return record
    }
}
