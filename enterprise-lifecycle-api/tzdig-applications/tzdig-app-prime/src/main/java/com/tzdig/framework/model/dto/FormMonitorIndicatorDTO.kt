@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.FormMonitorIndicator
import io.swagger.v3.oas.annotations.media.Schema

data class FormMonitorIndicatorDTO(
    @Schema(description = "支撑指标ID")
    val supportIndicatorId: String,
    @Schema(description = "监测指标名称")
    val indicatorName: String,
    @Schema(description = "收集频次")
    val collectionFrequency: String,
    @Schema(description = "责任部门")
    val department: String,
    @Schema(description = "监测指标简介")
    val description: String?,
    @Schema(description = "表单字段")
    val fields: List<FormMonitorIndicatorFieldDTO>
) {
    fun toFormMonitorIndicator(): FormMonitorIndicator =
        FormMonitorIndicator {
            into(this)
        }

    fun into(record: FormMonitorIndicator): FormMonitorIndicator {
        record.supportIndicatorId = supportIndicatorId
        record.indicatorName = indicatorName
        record.collectionFrequency = collectionFrequency
        record.department = department
        record.description = description
        return record
    }
}
