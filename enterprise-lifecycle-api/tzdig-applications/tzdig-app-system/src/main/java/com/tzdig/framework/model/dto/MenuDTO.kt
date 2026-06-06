package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.system.SystemMenu
import io.swagger.v3.oas.annotations.media.Schema

data class MenuDTO(
    @get:Schema(description = "页面路径")
    val path: String?,
    @get:Schema(description = "目录名称")
    val name: String,
    @get:Schema(description = "目录图标")
    val icon: String,
    @get:Schema(description = "排序")
    val sort: Int,
    @get:Schema(description = "父级菜单")
    val parentId: String?,
    @get:Schema(description = "客户端")
    var endpoint: SystemMenu.Endpoint?,
    @get:Schema(description = "是否为菜单项")
    val isMenu: Boolean?,
) {
    fun toSystemMenu(): SystemMenu = SystemMenu {
        into(this)
    }

    fun into(record: SystemMenu): SystemMenu {
        record.path = path
        record.name = name
        record.icon = icon
        record.sort = sort
        record.parentId = parentId
        record.endpoint = endpoint ?: SystemMenu.Endpoint.PC
        record.isMenu = isMenu ?: true
        return record
    }
}
