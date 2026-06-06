@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelIgnore
import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.FormMonitorIndicator
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema

data class FormMonitorIndicatorVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String,
    @get:Schema(description = "支撑指标ID")
    @ExcelProperty("支撑指标ID")
    val supportIndicatorId: String,
    @get:Schema(description = "支撑指标名称")
    @ExcelProperty("支撑指标名称")
    var supportIndicatorName: String = supportIndicatorId,
    @get:Schema(description = "收集频次")
    @ExcelIgnore
    val collectionFrequency: String,
    @get:Schema(description = "监测指标名称")
    @ExcelProperty("指标名称")
    val indicatorName: String,
    @get:Schema(description = "监测指标责任部门ID")
    @ExcelProperty("监测指标责任部门ID")
    val department: String,
    @get:Schema(description = "支撑指标责任部门ID")
    @ExcelProperty("支撑指标责任部门ID")
    var supportIndicatorDepartment: String? = null,
    @get:Schema(description = "监测指标简介")
    @ExcelProperty("监测指标简介")
    val description: String?,
) {
    @get:Schema(description = "收集频次")
    @ExcelProperty("收集频次")
    @get:JsonLabel("collection_frequency")
    var collectionFrequencyLabel: String = collectionFrequency
        get() = collectionFrequency
        private set

    @get:Schema(description = "监测指标责任部门名称")
    @ExcelProperty("监测指标责任部门名称")
    @get:JsonLabel("collection_dept")
    var departmentName: String = department
        get() = department
        private set

    @get:Schema(description = "支撑指标责任部门名称")
    @ExcelProperty("支撑指标责任部门名称")
    @get:JsonLabel("collection_dept")
    var supportIndicatorDepartmentName: String? = supportIndicatorDepartment
        get() = supportIndicatorDepartment
        private set

    constructor(record: FormMonitorIndicator) : this(
        id = record.id!!,
        supportIndicatorId = record.supportIndicatorId!!,
        collectionFrequency = record.collectionFrequency!!,
        indicatorName = record.indicatorName!!,
        department = record.department!!,
        description = record.description,
    )
}
