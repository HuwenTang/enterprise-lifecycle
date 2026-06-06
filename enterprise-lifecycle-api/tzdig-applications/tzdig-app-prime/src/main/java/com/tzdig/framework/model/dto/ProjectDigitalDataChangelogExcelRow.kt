@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalDataChangelog
import java.time.LocalDateTime

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectDigitalDataChangelogExcelRow(
    @field:ExcelProperty("表名")
    var tableName: String? = null,
    @field:ExcelProperty("表Id")
    var tableId: String? = null,
    @field:ExcelProperty("字段名称")
    var fieldName: String? = null,
    @field:ExcelProperty("旧值")
    var oldValue: String? = null,
    @field:ExcelProperty("新值")
    var newValue: String? = null,
    @field:ExcelProperty("变更人")
    var author: String? = null,
    @field:ExcelProperty("变更时间")
    var changedAt: LocalDateTime? = null,
) : ExcelRow<ProjectDigitalDataChangelogExcelRow>() {
    fun toProjectDigitalDataChangelog(): ProjectDigitalDataChangelog =
        ProjectDigitalDataChangelog {
            into(this)
        }

    fun into(record: ProjectDigitalDataChangelog): ProjectDigitalDataChangelog {
        record.tableName = tableName
        record.tableId = tableId
        record.fieldName = fieldName
        record.oldValue = oldValue
        record.newValue = newValue
        record.author = author
        record.changedAt = changedAt
        return record
    }
}
