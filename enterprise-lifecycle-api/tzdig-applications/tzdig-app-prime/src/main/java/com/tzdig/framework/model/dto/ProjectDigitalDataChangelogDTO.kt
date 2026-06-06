@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalDataChangelog
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectDigitalDataChangelogDTO(
    @param:Schema(description = "表名")
    val tableName: String?,
    @param:Schema(description = "表Id")
    val tableId: String?,
    @param:Schema(description = "字段名称")
    val fieldName: String?,
    @param:Schema(description = "旧值")
    val oldValue: String?,
    @param:Schema(description = "新值")
    val newValue: String?,
    @param:Schema(description = "变更人")
    var author: String?,
    @param:Schema(description = "变更时间")
    var changedAt: LocalDateTime?,
) {
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
