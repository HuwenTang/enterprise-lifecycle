package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.tzdig.framework.model.dto.PermissionDTO
import com.tzdig.framework.model.vo.KVPairList
import com.tzdig.framework.model.vo.KVPairVO
import com.tzdig.framework.model.vo.PermissionVO
import com.tzdig.framework.mybatis.entity.system.UserPermission
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.annotation.SaCheckRoot
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "权限管理")
@SaCheckRoot
@RestController
@RequestMapping("permission")
class PermissionController {
    @Operation(summary = "全部权限")
    @GetMapping("all")
    fun allPermission(
        @Schema(description = "组织ID")
        @RequestParam(defaultValue = "") organizationIds: Set<String>,
    ): KVPairList<String> =
        query<UserPermission> {
            orderBy(UserPermission::createTime).desc()
        }.map { KVPairVO(it.id!!, it.description!!) }

    @Operation(summary = "权限列表")
    @GetMapping
    @PageableQuery
    fun listPermission(
        @Schema(description = "搜索关键词：权限名称")
        @RequestParam("q", defaultValue = "") keyword: String,
    ): PageableResult<PermissionVO> {
        val page = paginate<UserPermission>(pageable.pageNumber, pageable.pageSize) {
            if (keyword.isNotEmpty()) and(UserPermission::description like keyword)
            orderBy(UserPermission::createTime).desc()
        }.map(::PermissionVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "修改权限")
    @PutMapping("{id}")
    fun updatePermission(
        @PathVariable id: String,
        @RequestBody dto: PermissionDTO,
    ) {
        val permission = queryOneById<UserPermission>(id)
            ?: throw NotFoundException("权限不存在")
        dto.into(permission).updateById()
    }
}
