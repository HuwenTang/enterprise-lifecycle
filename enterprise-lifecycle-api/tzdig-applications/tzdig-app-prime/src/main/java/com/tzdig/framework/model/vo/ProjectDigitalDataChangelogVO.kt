@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalDataChangelog
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectDigitalDataChangelogVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "表名")
    @ExcelProperty("表名")
    val tableName: String?,
    @get:Schema(description = "表Id")
    @ExcelProperty("表Id")
    val tableId: String?,
    @get:Schema(description = "字段名称")
    @ExcelProperty("字段名称")
    val fieldName: String?,
    @get:Schema(description = "旧值")
    @ExcelProperty("旧值")
    val oldValue: String?,
    @get:Schema(description = "新值")
    @ExcelProperty("新值")
    val newValue: String?,
    @get:Schema(description = "变更人")
    @ExcelProperty("变更人")
    val author: String?,
    @get:Schema(description = "变更时间")
    @ExcelProperty("变更时间")
    val changedAt: LocalDateTime?,
) {
    constructor(record: ProjectDigitalDataChangelog) : this(
        id = record.id,
        tableName = record.tableName,
        tableId = record.tableId,
        fieldName = record.fieldName,
        oldValue = record.oldValue,
        newValue = record.newValue,
        author = record.author,
        changedAt = record.changedAt,
    )
}
