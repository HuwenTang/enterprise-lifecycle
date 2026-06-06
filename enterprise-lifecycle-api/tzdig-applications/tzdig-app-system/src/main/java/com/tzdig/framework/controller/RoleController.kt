package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaCheckRole
import cn.dev33.satoken.annotation.SaMode
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.isNull
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.model.dto.RoleDTO
import com.tzdig.framework.model.vo.KVPairList
import com.tzdig.framework.model.vo.KVPairVO
import com.tzdig.framework.model.vo.RoleVO
import com.tzdig.framework.mybatis.entity.system.UserRole
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.annotation.SaCheckRoot
import com.tzdig.framework.security.extension.hasRole
import com.tzdig.framework.security.extension.roleIds
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "角色管理")
@RestController
@RequestMapping("role")
class RoleController(
    private val userService: UserService,
) {
    @SaCheckRole(SystemRole.ROOT, SystemRole.USER_ADMIN, mode = SaMode.OR)
    @Operation(summary = "全部角色")
    @GetMapping("all")
    fun allRole(
        @Schema(description = "组织ID")
        @RequestParam(defaultValue = "") organizationIds: Set<String>,
    ): KVPairList<String> {
        val list = query<UserRole> {
            where(UserRole::organizationId.isNull)
            if (organizationIds.isNotEmpty()) {
                or(UserRole::organizationId inList organizationIds)
            }
            orderBy(UserRole::createTime).desc()
        }.map { KVPairVO(it.id!!, it.name!!) }
        return if (userAccount.hasRole(SystemRole.ROOT)) list
        else list.filter { it.value in userAccount.roleIds }
    }

    @SaCheckRoot
    @Operation(summary = "角色列表")
    @GetMapping
    @PageableQuery
    fun listRole(
        @Schema(description = "组织ID")
        @RequestParam(required = false) organizationId: String?,
        @Schema(description = "搜索关键词：角色名称")
        @RequestParam("q", defaultValue = "") keyword: String,
    ): PageableResult<RoleVO> {
        val page = paginate<UserRole>(pageable.pageNumber, pageable.pageSize) {
            if (organizationId != null) and(UserRole::organizationId eq organizationId)
            if (keyword.isNotEmpty()) and(UserRole::name like keyword)
            orderBy(UserRole::createTime).desc()
        }.map(::RoleVO)
        return PageableResult.of(page)
    }

    @SaCheckRoot
    @Operation(summary = "添加角色")
    @PostMapping
    fun createRole(
        @RequestBody dto: RoleDTO,
    ) {
        dto.toUserRole().save()
    }

    @SaCheckRoot
    @Operation(summary = "修改角色")
    @PutMapping("{id}")
    fun updateRole(
        @PathVariable id: String,
        @RequestBody dto: RoleDTO,
    ) {
        val role = userService.getUserRoleById(id)
            ?: throw NotFoundException("角色不存在")
        if (role.systemRole == true)
            throw ApiException("系统角色不允许修改")
        dto.into(role).updateById()
        userService.updateCache(role)
    }

    @SaCheckRoot
    @Operation(summary = "删除角色")
    @DeleteMapping("{id}")
    fun deleteRole(
        @PathVariable id: String,
    ) {
        val role = userService.getUserRoleById(id)
            ?: throw NotFoundException("角色不存在")
        if (role.systemRole == true)
            throw ApiException("系统角色不允许修改")
        role.removeById()
        userService.removeCache(role)
    }
}
