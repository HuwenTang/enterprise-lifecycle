package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaCheckRole
import cn.dev33.satoken.annotation.SaMode
import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryListByIds
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.model.batchDeleteById
import com.mybatisflex.kotlin.extensions.model.batchInsert
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.model.vo.AreaVO
import com.tzdig.framework.model.vo.UserAreaGrantsVO
import com.tzdig.framework.mybatis.entity.system.*
import com.tzdig.framework.security.extension.hasAnyRole
import com.tzdig.framework.security.extension.roleIds
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.web.annotation.Log
import com.tzdig.framework.web.annotation.LogType
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.exception.UnauthorizedException
import com.tzdig.framework.web.service.AreaService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "用户授权管理")
@SaCheckRole(SystemRole.ROOT, SystemRole.USER_ADMIN, mode = SaMode.OR)
@RestController
@RequestMapping("user/{userid}")
class UserGrantsController(
    private val userService: UserService,
    private val areaService: AreaService,
    private val dataGrantsUtils: DataGrantsUtils,
) {
    @Operation(summary = "查询用户角色")
    @GetMapping("role")
    fun getUserRole(
        @Schema(description = "用户ID")
        @PathVariable userid: String,
    ): List<String> {
        val userAccount = userService.getUserAccountById(userid)
            ?: throw NotFoundException("用户不存在")
        return userAccount.roleIds
    }

    @Log("用户管理/修改角色", type = LogType.UPDATE)
    @Operation(summary = "修改用户角色")
    @PutMapping("role")
    fun updateUserRole(
        @Schema(description = "用户ID")
        @PathVariable userid: String,
        @Schema(description = "角色ID")
        @RequestBody roleIds: Set<String>,
    ) {
        val userRoles = userAccount.roleIds
        val newRoleList = if (SystemRole.ROOT in userRoles) {
            filter<UserRole> { UserRole::id inList roleIds }
        } else {
            filter<UserRole> { UserRole::id inList userRoles.intersect(roleIds) }
        }
        val oldRoles = filter<UserXRole> { UserXRole::userid eq userid }
        val newRoles = newRoleList
            .filter { it.id != SystemRole.DEFAULT }
            .map {
                UserXRole {
                    this.userid = userid
                    this.roleId = it.id
                }
            }
        oldRoles.filter { x -> x.roleId !in newRoles.map { it.roleId } }
            .takeIf { it.isNotEmpty() }
            ?.batchDeleteById()
        newRoles.filter { x -> x.roleId !in oldRoles.map { it.roleId } }
            .takeIf { it.isNotEmpty() }
            ?.batchInsert()
        userService.updateUserRoleCache(userid, newRoles.map { it.roleId!! })
    }

    @Operation(summary = "查询用户权限")
    @GetMapping("permission")
    fun getUserPermission(
        @Schema(description = "用户ID")
        @PathVariable userid: String,
    ): List<String> {
        return userService.getUserPermissionByUserid(userid)
    }

    @Log("用户管理/修改权限", type = LogType.UPDATE)
    @Operation(summary = "修改用户权限")
    @PutMapping("permission")
    fun updateUserPermission(
        @Schema(description = "用户ID")
        @PathVariable userid: String,
        @Schema(description = "权限代码")
        @RequestBody permissionCodes: Set<String>,
    ) {
        val userAccount = userService.getUserAccountById(userid)
            ?: throw NotFoundException("用户不存在")
        // TODO: val newPermissionList
        val oldPermissions = filter<UserXPermission> { UserXPermission::userid eq userAccount.id }
        val newPermissions = permissionCodes.map { permissionCode ->
            UserXPermission {
                this.userid = userid
                this.permissionCode = permissionCode
            }
        }
        oldPermissions.filter { x -> x.permissionCode !in newPermissions.map { it.permissionCode } }
            .takeIf { it.isNotEmpty() }
            ?.batchDeleteById()
        newPermissions.filter { x -> x.permissionCode !in oldPermissions.map { it.permissionCode } }
            .takeIf { it.isNotEmpty() }
            ?.batchInsert()
        userService.updateUserPermissionCache(userid, permissionCodes.sorted())
    }

    @Operation(summary = "查询数据授权记录")
    @GetMapping("area-grants")
    fun getAreaGrants(
        @Schema(description = "用户ID")
        @PathVariable userid: String,
    ): UserAreaGrantsVO {
        val list = filter<UserAreaGrants> { UserAreaGrants::userid eq userid }
        if (list.isEmpty()) {
            return UserAreaGrantsVO(userid, emptyList(), emptyList())
        }
        val areas = queryListByIds<SystemArea>(list.map { it.areaId!! })
        val data4cascader = areas.mapNotNull { area ->
            when (area.level?.toInt()) {
                2 -> listOf(area.id!!)
                3 -> listOf(area.parentCode!!, area.id!!)
                4 -> listOf(AreaConstant.TAIZHOU_CODE, area.parentCode!!, area.id!!)
                else -> null
            }
        }
        return UserAreaGrantsVO(
            userid = userid,
            areas = areas.map(::AreaVO),
            data4cascader = data4cascader,
        )
    }

    @Log("用户管理/修改数据授权", type = LogType.UPDATE)
    @Operation(summary = "修改数据授权记录")
    @PutMapping("area-grants")
    fun updateAreaGrants(
        @Schema(description = "用户ID")
        @PathVariable userid: String,
        @Schema(description = "区划ID")
        @RequestBody areaIdList: Collection<String>,
    ) {
        userService.getUserAccountById(userid)
            ?: throw ApiException("用户不存在")
        val oldGrants = filter<UserAreaGrants> { UserAreaGrants::userid eq userid }
        val grantedAreas = DataGrantsUtils.grantedAreas
        val newGrants = areaService.getAllChildren(queryListByIds<SystemArea>(areaIdList))
            .map { it.id }
            .let {
                if (userAccount.hasAnyRole(SystemRole.ROOT, SystemRole.PROJECT_CITY)) it
                else it.intersect(grantedAreas)
            }
            .map {
                UserAreaGrants {
                    this.userid = userid
                    this.areaId = it
                    this.active = true
                }
            }
        oldGrants.filter { x -> x.areaId !in newGrants.map { it.areaId } }
            .takeIf { it.isNotEmpty() }
            ?.batchDeleteById()
        newGrants.filter { x -> x.areaId !in oldGrants.map { it.areaId } }
            .takeIf { it.isNotEmpty() }
            ?.batchInsert()
        dataGrantsUtils.flushCache(userid, newGrants.map { it.areaId!! })
    }

    @Deprecated("")
    @Operation(summary = "查询当前用户数据权限", hidden = true)
    @GetMapping("data-grants/areas")
    fun getCurrentDataGrants(
        @PathVariable userid: String,
        @Schema(description = "区划级别")
        @RequestParam(defaultValue = "") level: Collection<Short>,
    ): List<AreaVO> {
        if (userid != userAccount.id) {
            throw UnauthorizedException
        }
        val areas = DataGrantsUtils.grantedAreas
        if (areas.isEmpty()) return emptyList()
        val list = query<SystemArea> {
            where(SystemArea::id inList areas)
            if (level.isNotEmpty()) and(SystemArea::level inList level)
            orderBy(SystemArea::level).asc()
        }
        return list.map(::AreaVO)
    }
}
