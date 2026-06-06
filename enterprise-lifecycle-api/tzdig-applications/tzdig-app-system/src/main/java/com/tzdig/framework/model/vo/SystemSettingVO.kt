package com.tzdig.framework.model.vo

import com.tzdig.framework.mybatis.entity.system.SystemSetting
import io.swagger.v3.oas.annotations.media.Schema

data class SystemSettingVO(
    @get:Schema(description = "系统配置名称")
    val name: String,
    @get:Schema(description = "系统配置值")
    val value: String,
    @get:Schema(description = "系统配置描述")
    val description: String,
) {
    constructor(record: SystemSetting) : this(
        name = record.name!!,
        value = record.value!!,
        description = record.description!!,
    )
}
