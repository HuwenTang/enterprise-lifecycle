package com.tzdig.framework.model.vo

import com.tzdig.framework.mybatis.entity.system.SystemDictCatalog
import io.swagger.v3.oas.annotations.media.Schema

data class SystemDictCatalogVO(
    @Schema(description = "目录ID")
    val id: String,
    @Schema(description = "父目录代码")
    val parentCode: String?,
    @Schema(description = "目录代码")
    val code: String,
    @Schema(description = "目录名称")
    val label: String,
    @Schema(description = "子目录")
    var children: List<SystemDictCatalogVO>? = null
) {
    constructor(systemDictCatalog: SystemDictCatalog) : this(
        id = systemDictCatalog.id!!,
        parentCode = systemDictCatalog.parentCode,
        code = systemDictCatalog.code!!,
        label = systemDictCatalog.label!!,
    )
}
