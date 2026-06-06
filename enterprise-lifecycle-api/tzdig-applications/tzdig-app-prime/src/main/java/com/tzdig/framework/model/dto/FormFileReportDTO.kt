@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.FormFileReport
import io.swagger.v3.oas.annotations.media.Schema

data class FormFileReportDTO(
    @Schema(description = "任务名称")
    val indicatorName: String,
    @Schema(description = "收集频次")
    val collectionFrequency: String,
    @Schema(description = "责任部门")
    val department: String,
    @Schema(description = "任务简介")
    val description: String?,
    @Schema(description = "文件模板")
    val fileTemplate: String?,
) {
    fun toFormFileReport(): FormFileReport =
        FormFileReport {
            into(this)
        }

    fun into(record: FormFileReport): FormFileReport {
        record.taskName = indicatorName
        record.collectionFrequency = collectionFrequency
        record.department = department
        record.description = description
        record.fileTemplate = fileTemplate
        return record
    }
}
