package com.tzdig.framework.model.vo

import com.tzdig.framework.mybatis.entity.system.UserRole
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class RoleVO(
    @Schema(description = "角色ID")
    val id: String,
    @Schema(description = "角色名称")
    val name: String,
    @Schema(description = "创建时间")
    val createTime: LocalDateTime,
    @Schema(description = "是否为系统角色")
    val systemRole: Boolean,
) {
    constructor(record: UserRole) : this(
        id = record.id!!,
        name = record.name!!,
        createTime = record.createTime!!,
        systemRole = record.systemRole!!,
    )
}

