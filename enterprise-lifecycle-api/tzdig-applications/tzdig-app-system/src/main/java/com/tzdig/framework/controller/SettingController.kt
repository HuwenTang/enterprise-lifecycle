package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaIgnore
import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.model.dto.SystemSettingDTO
import com.tzdig.framework.model.vo.DefaultSettingsVO
import com.tzdig.framework.model.vo.SystemSettingVO
import com.tzdig.framework.mybatis.entity.system.SystemSetting
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.util.SettingsUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "系统配置管理")
@RestController
@RequestMapping("settings")
class SettingController(
    private val settingsUtils: SettingsUtils,
) {
    @SaIgnore
    @Operation(summary = "获取默认系统配置")
    @GetMapping("default")
    fun getDefaultSettings() = DefaultSettingsVO

    @Operation(summary = "获取系统配置列表")
    @GetMapping
    @PageableQuery
    fun listSystemSetting(
    ): PageableResult<SystemSettingVO> {
        val page = paginate<SystemSetting>(pageable.pageNumber, pageable.pageSize) {
            orderBy(SystemSetting::name)
        }.map(::SystemSettingVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "新建系统配置")
    @PostMapping
    fun createSystemSetting(
        @RequestBody dto: SystemSettingDTO,
    ) {
        val cnt = queryCount<SystemSetting> { where(SystemSetting::name eq dto.name) }
        if (cnt > 0) {
            throw ApiException("系统配置已存在")
        }
        dto.toSystemSetting().save()
    }

    @Operation(summary = "修改系统配置")
    @PutMapping("{name}")
    fun updateSystemSetting(
        @Schema(description = "系统配置名称")
        @PathVariable name: String,
        @RequestBody dto: SystemSettingDTO,
    ) {
        val record = filterOne<SystemSetting> { SystemSetting::name eq name }
            ?: throw ApiException("系统配置不存在")
        dto.into(record)
        record.updateById()
        settingsUtils.flushCache(record.name!!)
    }

    @Operation(summary = "删除系统配置")
    @DeleteMapping("{name}")
    fun deleteSystemSetting(
        @Schema(description = "系统配置名称")
        @PathVariable name: String,
    ) {
        val record = filterOne<SystemSetting> { SystemSetting::name eq name }
            ?: throw ApiException("系统配置不存在")
        record.removeById()
        settingsUtils.flushCache(record.name!!)
    }
}
