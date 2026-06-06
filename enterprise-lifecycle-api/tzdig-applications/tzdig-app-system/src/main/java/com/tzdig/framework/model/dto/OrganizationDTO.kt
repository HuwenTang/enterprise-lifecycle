package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.system.UserOrganization
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.PositiveOrZero

data class OrganizationDTO(
    @Schema(description = "组织名称")
    val name: String,
    @Schema(description = "父级组织ID")
    val parentId: String,
    @Schema(description = "排序")
    @field:PositiveOrZero(message = "sort值无效")
    val sort: Int,
) {
    fun toUserOrganization(): UserOrganization =
        with(UserOrganization()) {
            into(this)
        }

    fun into(record: UserOrganization): UserOrganization {
        record.name = name
        record.parentId = parentId
        record.sort = sort
        return record
    }
}
