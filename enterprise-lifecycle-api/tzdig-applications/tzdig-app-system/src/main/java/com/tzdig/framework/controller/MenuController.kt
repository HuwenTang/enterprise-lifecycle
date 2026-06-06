package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.model.batchDeleteById
import com.mybatisflex.kotlin.extensions.model.batchInsert
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.model.dto.MenuDTO
import com.tzdig.framework.model.vo.MenuVO
import com.tzdig.framework.mybatis.entity.system.SystemMenu
import com.tzdig.framework.mybatis.entity.system.SystemMenuXRole
import com.tzdig.framework.mybatis.entity.system.UserRole
import com.tzdig.framework.security.annotation.SaCheckRoot
import com.tzdig.framework.security.extension.roleIds
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.web.exception.ApiException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "菜单管理")
@RestController
@RequestMapping("menu")
class MenuController {
    @Operation(summary = "创建菜单")
    @SaCheckRoot
    @PostMapping
    fun createMenu(@RequestBody menu: MenuDTO) {
        if (menu.parentId != null) {
            queryOneById<SystemMenu>(menu.parentId) ?: throw ApiException("父级菜单不存在")
        }
        menu.toSystemMenu().save()
    }

    @Operation(summary = "删除菜单")
    @SaCheckRoot
    @DeleteMapping("{id}")
    fun deleteMenu(
        @PathVariable id: String,
    ) {
        if (queryCount<SystemMenu> { where(SystemMenu::parentId eq id) } > 0)
            throw ApiException("存在子菜单，无法删除")
        deleteById<SystemMenu>(id)
    }

    @Operation(summary = "修改菜单")
    @SaCheckRoot
    @PutMapping("{id}")
    fun updateMenu(
        @PathVariable id: String,
        @RequestBody menu: MenuDTO,
    ) {
        val record = queryOneById<SystemMenu>(id)
            ?: throw ApiException("菜单不存在")
        menu.into(record).updateById()
    }

    @Operation(summary = "查询菜单列表")
    @SaCheckRoot
    @GetMapping
    fun getMenuList(): List<MenuVO> {
        val list = with(all<SystemMenu>()) {
            val ids = map { it.id }
            val toDelete = filter { it.parentId != null && it.parentId !in ids }
            if (toDelete.isNotEmpty()) toDelete.batchDeleteById()
            this - toDelete
        }
        val menus = list.map { MenuVO(it, it.id) }
        val group = menus
            .sortedBy { it.obj.sort }
            .groupBy { it.obj.parentId }
        menus.forEach { it.children = group[it.obj.id] ?: emptyList() }
        return group[null] ?: emptyList()
    }

    @Operation(summary = "查询菜单角色")
    @SaCheckRoot
    @GetMapping("{id}/role")
    fun getMenuRole(
        @Schema(description = "角色ID")
        @PathVariable id: String,
    ): List<String> {
        val roles = with(filter<SystemMenuXRole> { SystemMenuXRole::menuId eq id }) {
            if (isEmpty()) return emptyList()
            queryListByIds<UserRole>(mapNotNull { it.roleId })
        }
        return roles.map { it.id!! }
    }

    @Operation(summary = "修改菜单角色")
    @SaCheckRoot
    @PutMapping("{id}/role")
    fun setMenuRole(
        @Schema(description = "菜单ID")
        @PathVariable id: String,
        @RequestBody roleIds: Set<String>,
    ) {
        val oldX = filter<SystemMenuXRole> { SystemMenuXRole::menuId eq id }
        val newX = roleIds
            .filter { it != SystemRole.ROOT }
            .map {
                SystemMenuXRole {
                    menuId = id
                    roleId = it
                }
            }
        oldX.filter { x -> x.roleId !in newX.map { it.roleId } }
            .takeIf { it.isNotEmpty() }
            ?.batchDeleteById()
        newX.filter { x -> x.roleId !in oldX.map { it.roleId } }
            .takeIf { it.isNotEmpty() }
            ?.batchInsert()
    }

    @Operation(summary = "动态路由")
    @GetMapping("{endpoint}/route")
    fun getRoute(
        @Schema(description = "客户端", defaultValue = "PC")
        @PathVariable endpoint: SystemMenu.Endpoint,
    ): List<MenuVO> {
        val roleIds = userAccount.roleIds
        if (roleIds.isEmpty()) return emptyList()
        val list = if (SystemRole.ROOT in roleIds) {
            filter<SystemMenu> { SystemMenu::endpoint eq endpoint }
        } else with(filter<SystemMenuXRole> { SystemMenuXRole::roleId inList roleIds }) {
            if (isEmpty()) return emptyList()
            queryListByIds<SystemMenu>(mapNotNull { it.menuId })
                .filter { it.endpoint == endpoint }
        }
        return list.map(::MenuVO)
    }

    @Operation(summary = "查询用户菜单")
    @GetMapping("{endpoint}")
    fun getMenu(
        @Schema(description = "客户端", defaultValue = "PC")
        @PathVariable endpoint: SystemMenu.Endpoint,
    ): List<MenuVO> {
        val menus = this.getRoute(endpoint)
            .filter { it.isMenu }
        val group = menus
            .sortedBy { it.obj.sort }
            .groupBy { it.obj.parentId }
        menus.forEach { it.children = group[it.obj.id] ?: emptyList() }
        return group[null] ?: emptyList()
    }

    @Deprecated("Deprecated")
    @Operation(summary = "动态路由", hidden = true)
    @GetMapping("route")
    fun getRoutes() = getRoute(SystemMenu.Endpoint.PC)

    @Deprecated("Deprecated")
    @Operation(summary = "查询用户菜单", hidden = true)
    @GetMapping("current")
    fun getCurrentMenu() = getMenu(SystemMenu.Endpoint.PC)
}
