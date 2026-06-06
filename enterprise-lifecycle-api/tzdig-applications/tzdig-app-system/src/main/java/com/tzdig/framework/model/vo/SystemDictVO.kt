package com.tzdig.framework.model.vo

import com.tzdig.framework.mybatis.entity.system.SystemDict
import io.swagger.v3.oas.annotations.media.Schema

data class SystemDictVO(
    @Schema(description = "字典代码")
    val code: String,
    @Schema(description = "字典名称")
    val label: String,
    @Schema(description = "是否启用")
    val enabled: Boolean,
    @Schema(description = "排序")
    val sort: Int,
) {
    @get:Schema(description = "字典代码")
    val value: String get() = code

    constructor(systemDict: SystemDict) : this(
        code = systemDict.code!!,
        label = systemDict.label!!,
        enabled = systemDict.enabled!!,
        sort = systemDict.sort!!,
    )
}
