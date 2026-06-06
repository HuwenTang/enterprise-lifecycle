@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.file.annotation.S3Transformable
import com.tzdig.framework.mybatis.entity.prime.FormFileReport
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema

data class FormFileReportVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String,
    @get:Schema(description = "任务名称")
    @ExcelProperty("任务名称")
    val indicatorName: String,
    @get:Schema(description = "收集频次")
    @ExcelProperty("收集频次")
    val collectionFrequency: String,
    @get:Schema(description = "责任部门")
    @ExcelProperty("责任部门")
    val department: String,
    @get:Schema(description = "任务简介")
    @ExcelProperty("任务简介")
    val description: String?,
    @get:Schema(description = "文件模板")
    @ExcelProperty("文件模板")
    var fileTemplate: String?,
) : S3Transformable {
    @get:Schema(description = "收集频次")
    @ExcelProperty("收集频次")
    @get:JsonLabel("collection_frequency")
    var collectionFrequencyLabel: String? = null
        get() = collectionFrequency
        private set

    @get:Schema(description = "责任部门")
    @ExcelProperty("责任部门")
    @get:JsonLabel("collection_dept")
    var departmentLabel: String? = null
        get() = department
        private set

    @get:Schema(description = "责任部门名称")
    @ExcelProperty("责任部门名称")
    @get:JsonLabel("collection_dept")
    var departmentName: String? = null
        get() = department
        private set

    constructor(record: FormFileReport) : this(
        id = record.id!!,
        indicatorName = record.taskName!!,
        collectionFrequency = record.collectionFrequency!!,
        department = record.department!!,
        description = record.description,
        fileTemplate = record.fileTemplate,
    )

    override fun s3transform(transform: (String) -> String) {
        fileTemplate = fileTemplate?.let(transform)
    }
}
