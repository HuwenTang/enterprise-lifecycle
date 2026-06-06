package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.system.SystemDictCatalog
import io.swagger.v3.oas.annotations.media.Schema

data class SystemDictCatalogDTO(
    @Schema(description = "父目录代码")
    val parentCode: String?,
    @Schema(description = "目录代码")
    val code: String,
    @Schema(description = "目录名称")
    val label: String,
) {
    fun toSystemDictCatalog(): SystemDictCatalog =
        SystemDictCatalog {
            this.code = this@SystemDictCatalogDTO.code
            into(this)
        }

    fun into(record: SystemDictCatalog): SystemDictCatalog {
        record.parentCode = parentCode
        record.label = label
        return record
    }
}
