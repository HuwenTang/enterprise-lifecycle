package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.system.UserPermission
import io.swagger.v3.oas.annotations.media.Schema

data class PermissionDTO(
    @Schema(description = "权限描述")
    val description: String,
) {
    fun toUserPermission(): UserPermission =
        with(UserPermission()) {
            into(this)
        }

    fun into(record: UserPermission): UserPermission {
        record.description = description
        return record
    }
}

