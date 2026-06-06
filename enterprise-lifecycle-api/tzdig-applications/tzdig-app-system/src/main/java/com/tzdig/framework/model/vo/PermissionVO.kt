package com.tzdig.framework.model.vo

import com.tzdig.framework.mybatis.entity.system.UserPermission
import io.swagger.v3.oas.annotations.media.Schema

data class PermissionVO(
    @Schema(description = "角色ID")
    val id: String,
    @Schema(description = "权限描述")
    val description: String,
) {
    constructor(record: UserPermission) : this(
        id = record.id!!,
        description = record.description!!,
    )
}

