package com.tzdig.framework.model.vo

import com.fasterxml.jackson.annotation.JsonFormat
import com.tzdig.framework.mongo.entity.FormIndicatorRecord
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

@Suppress("unused")
data class FormIndicatorRecordVO(
    val id: String,
    @get:Schema(description = "支撑指标ID")
    val supportIndicatorId: String?,
    @get:Schema(description = "监测指标ID")
    val monitorIndicatorId: String?,
    @get:Schema(description = "监测指标名称")
    var monitorIndicatorName: String? = null,
    @get:Schema(description = "文件报送任务ID")
    val fileReportTaskId: String?,
    @get:Schema(description = "文件报送任务名称")
    var fileReportTaskName: String? = null,
    @get:Schema(description = "收集频次")
    val collectionFrequency: String,
    @get:Schema(description = "周期-开始日期")
    @get:JsonFormat(pattern = "yyyy-MM-dd")
    val startDate: LocalDate,
    @get:Schema(description = "周期-结束日期")
    @get:JsonFormat(pattern = "yyyy-MM-dd")
    var endDate: LocalDate,
    @get:Schema(description = "季度")
    val quarter: Int,
    @get:Schema(description = "月度")
    val month: Int,
    @get:Schema(description = "周次")
    val weekOfMonth: Int,
    @get:Schema(description = "责任部门ID")
    val department: String,
    @get:Schema(description = "是否已填报")
    val submitted: Boolean,
    @get:Schema(description = "data")
    var data: Map<String, String>,
) {
    @get:Schema(description = "收集频次")
    @get:JsonLabel("collection_frequency")
    val collectionFrequencyLabel: String get() = collectionFrequency

    @get:Schema(description = "责任部门名称")
    @get:JsonLabel("collection_dept")
    val departmentName: String get() = department

    constructor(record: FormIndicatorRecord) : this(
        id = record.id!!,
        supportIndicatorId = record.supportIndicatorId,
        monitorIndicatorId = record.monitorIndicatorId,
        fileReportTaskId = record.fileReportTaskId,
        collectionFrequency = record.collectionFrequency!!,
        startDate = record.createTime!!.toLocalDate(),
        endDate = record.createTime!!.toLocalDate(),
        quarter = record.quarter!!,
        month = record.month!!,
        weekOfMonth = record.weekOfMonth!!,
        department = record.department!!,
        submitted = record.submitted!!,
        data = record.data!!,
    )
}
