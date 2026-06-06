package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.all
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.model.dto.SystemDictCatalogDTO
import com.tzdig.framework.model.vo.SystemDictCatalogVO
import com.tzdig.framework.mybatis.entity.system.SystemDictCatalog
import com.tzdig.framework.security.annotation.SaCheckRoot
import com.tzdig.framework.web.exception.ApiException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "字典表管理")
@SaCheckRoot
@RestController
@RequestMapping("dict/catalog")
class DictCatalogController {
    @Operation(summary = "获取字典目录树")
    @GetMapping("tree")
    fun getDictCatalogTree(): List<SystemDictCatalogVO> {
        val list = all<SystemDictCatalog>()
            .map { it.parentCode to SystemDictCatalogVO(it) }
        list.groupBy { it.first }
            .forEach { (parentCode, pairs) ->
                val pair = list.find { it.second.code == parentCode } ?: return@forEach
                pair.second.children = pairs.map { it.second }
            }
        return list.filter { it.first == null }.map { it.second }
    }

    @Operation(summary = "新建字典目录")
    @PostMapping
    fun createDictCatalog(
        @RequestBody dto: SystemDictCatalogDTO,
    ) {
        val exists = queryCount<SystemDictCatalog> {
            where(SystemDictCatalog::code eq dto.code)
        } > 0
        if (exists) throw ApiException("目录${dto.code}已存在")
        if (dto.parentCode != null) {
            val count = queryCount<SystemDictCatalog> { SystemDictCatalog::code eq dto.parentCode }
            if (count == 0L) throw ApiException("父目录不存在")
        }
        dto.toSystemDictCatalog().save()
    }

    @Operation(summary = "修改字典目录")
    @PutMapping("{id}")
    fun updateDictCatalog(
        @PathVariable id: String,
        @RequestBody dto: SystemDictCatalogDTO,
    ) {
        val record = queryOneById<SystemDictCatalog>(id)
            ?: throw ApiException("目录不存在")
        dto.into(record).updateById()
    }
}
