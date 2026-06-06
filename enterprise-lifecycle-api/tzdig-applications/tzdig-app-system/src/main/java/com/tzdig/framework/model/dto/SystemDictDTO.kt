package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.system.SystemDict
import com.tzdig.framework.web.annotation.Validatable
import io.swagger.v3.oas.annotations.media.Schema

data class SystemDictDTO(
    @get:Schema(description = "字典目录")
    val catalog: String,
    @get:Schema(description = "字典代码")
    val code: String,
    @get:Schema(description = "字典名称")
    val label: String,
    @get:Schema(description = "是否启用")
    val enabled: Boolean,
    @get:Schema(description = "排序")
    val sort: Int,
) : Validatable {
    override fun validate(): String? {
        if (catalog.isBlank()) return "字典目录不可为空"
        if (code.isBlank()) return "字典代码不可为空"
        if (label.isBlank()) return "字典名称不可为空"
        return null
    }

    fun toSystemDict(): SystemDict =
        with(SystemDict()) {
            into(this)
        }

    fun into(record: SystemDict): SystemDict {
        record.catalog = catalog
        record.code = code
        record.label = label
        record.enabled = enabled
        record.sort = sort
        return record
    }
}
