package com.tzdig.framework.model.vo

import com.fasterxml.jackson.annotation.JsonIgnore
import com.tzdig.framework.mybatis.entity.system.SystemMenu
import io.swagger.v3.oas.annotations.media.Schema

data class MenuVO(
    val id: String?,
    @get:Schema(description = "页面路径")
    val path: String?,
    @get:Schema(description = "目录名称")
    val name: String,
    @get:Schema(description = "目录图标")
    val icon: String,
    @get:Schema(description = "排序")
    val sort: Int,
    @get:Schema(description = "父级菜单")
    val parentId: String,
    @get:Schema(description = "客户端")
    val endpoint: SystemMenu.Endpoint,
    @get:Schema(description = "子菜单")
    var children: List<MenuVO>,
    @JsonIgnore
    val isMenu: Boolean,
    @JsonIgnore
    val obj: SystemMenu,
) {
    constructor(record: SystemMenu, id: String? = null) : this(
        id = id,
        path = record.path,
        name = record.name!!,
        icon = record.icon!!,
        sort = record.sort!!,
        parentId = record.parentId ?: "",
        endpoint = record.endpoint!!,
        isMenu = record.isMenu!!,
        children = emptyList(),
        obj = record,
    )

    @Suppress("unused")
    @get:Schema(description = "Alias For 'id'")
    val value get() = id

    @Suppress("unused")
    @get:Schema(description = "Alias For 'name'")
    val title get() = name
}
