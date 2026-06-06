package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.system.SystemSetting
import io.swagger.v3.oas.annotations.media.Schema

data class SystemSettingDTO(
    @get:Schema(description = "系统配置名称")
    val name: String,
    @get:Schema(description = "系统配置值")
    val value: String,
    @get:Schema(description = "系统配置描述")
    val description: String,
) {
    fun toSystemSetting(): SystemSetting =
        SystemSetting {
            into(this)
        }

    fun into(record: SystemSetting) {
        record.name = name
        record.value = value
        record.description = description
    }
}
