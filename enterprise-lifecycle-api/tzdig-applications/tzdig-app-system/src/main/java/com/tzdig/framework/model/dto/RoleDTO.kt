package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.system.UserRole
import io.swagger.v3.oas.annotations.media.Schema

data class RoleDTO(
    @Schema(description = "角色名称")
    val name: String,
    @Schema(description = "关联组织ID, null=全局角色")
    val organizationId: String?,
) {
    fun toUserRole(): UserRole =
        with(UserRole()) {
            this.systemRole = false
            into(this)
        }

    fun into(record: UserRole): UserRole {
        record.name = name
        record.organizationId = organizationId
        return record
    }
}
