package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.deleteWith
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.model.dto.SystemDictDTO
import com.tzdig.framework.model.vo.SystemDictVO
import com.tzdig.framework.mybatis.entity.system.SystemDict
import com.tzdig.framework.mybatis.entity.system.SystemDictCatalog
import com.tzdig.framework.security.annotation.SaCheckRoot
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.util.DictUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "字典表管理")
@RestController
@RequestMapping("dict")
class DictController(
    private val dictUtils: DictUtils,
) {
    @Operation(summary = "新建/修改字典项")
    @SaCheckRoot
    @PostMapping
    fun createOrUpdateDictItem(
        @RequestBody dto: SystemDictDTO,
    ) {
        if (queryCount<SystemDictCatalog> { SystemDictCatalog::code eq dto.catalog } == 0L) {
            throw ApiException("字典目录'${dto.catalog}'不存在")
        }
        val record = queryOne<SystemDict> {
            where(SystemDict::catalog eq dto.catalog)
            and(SystemDict::code eq dto.code)
        } ?: SystemDict()
        dto.into(record).saveOrUpdate()
        dictUtils.flushCache(record.catalog!!)
        dictUtils.flushCache(record.catalog!!, record.code!!)
    }

    @Operation(summary = "删除字典项")
    @SaCheckRoot
    @DeleteMapping("{catalog}/items/{code}")
    fun deleteDictItem(
        @Schema(description = "所属目录")
        @PathVariable catalog: String,
        @Schema(description = "字典代码")
        @PathVariable code: String,
    ) {
        deleteWith<SystemDict> {
            (SystemDict::catalog eq catalog)
                .and(SystemDict::code eq code)
        }
        dictUtils.flushCache(catalog)
        dictUtils.flushCache(catalog, code)
    }

    @Operation(summary = "获取字典项")
    @GetMapping("{catalog}/items")
    fun getDictItems(
        @Schema(description = "所属目录")
        @PathVariable catalog: String,
        @RequestParam(defaultValue = "false") all: Boolean
    ): List<SystemDictVO> {
        val list = if (all) dictUtils.getAllDictItems(catalog)
        else dictUtils.getDictItems(catalog)
        return list.map(::SystemDictVO)
    }
}
