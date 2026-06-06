package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.GdpStatisticalDataDTO
import com.tzdig.framework.model.dto.GdpStatisticalDataExcelRow
import com.tzdig.framework.model.vo.GdpStatisticalDataVO
import com.tzdig.framework.mybatis.entity.prime.GdpStatisticalData
import com.tzdig.framework.mybatis.mapper.prime.GdpStatisticalDataMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "分市区基础数据明细管理")
@RestController
@RequestMapping("gdp-statistical-data")
class GdpStatisticalDataController {
    @Operation(summary = "查询统计局GDP数据列表")
    //@SaCheckPermission("gdp-statistical-data::query")
    @GetMapping
    @PageableQuery
    fun listGdpStatisticalData(
        pageable: Pageable,
        @Schema(description = "记录ID")
        @RequestParam() recordId: String,
    ): PageableResult<GdpStatisticalDataVO> {
        val page = paginate<GdpStatisticalData>(pageable.pageNumber, pageable.pageSize) {
            and(GdpStatisticalData::recordId eq recordId)
        }.map(::GdpStatisticalDataVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询分市区基础数据明细")
    //@SaCheckPermission("gdp-statistical-data::query")
    @GetMapping("{id}")
    fun getGdpStatisticalData(
        @PathVariable id: String,
    ): GdpStatisticalDataVO {
        val record = queryOneById<GdpStatisticalData>(id)
            ?: throw NotFoundException("分市区基础数据明细不存在")
        return GdpStatisticalDataVO(record)
    }

    @Operation(summary = "创建分市区基础数据明细")
    //@SaCheckPermission("gdp-statistical-data::create")
    @PostMapping
    fun createGdpStatisticalData(
        @RequestBody dto: GdpStatisticalDataDTO,
    ) {
        dto.toGdpStatisticalData().save()
    }

    @Operation(summary = "修改分市区基础数据明细")
    //@SaCheckPermission("gdp-statistical-data::update")
    @PutMapping("{id}")
    fun updateGdpStatisticalData(
        @PathVariable id: String,
        @RequestBody dto: GdpStatisticalDataDTO,
    ) {
        val record = queryOneById<GdpStatisticalData>(id)
            ?: throw NotFoundException("分市区基础数据明细不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除分市区基础数据明细")
    //@SaCheckPermission("gdp-statistical-data::delete")
    @DeleteMapping("{id}")
    fun deleteGdpStatisticalData(
        @PathVariable id: String,
    ) {
        val result = deleteById<GdpStatisticalData>(id)
        if (result == 0) throw NotFoundException("分市区基础数据明细不存在")
    }

    @Operation(summary = "分市区基础数据明细导入模板")
    //@SaCheckPermission("gdp-statistical-data::create")
    @GetMapping("template.xlsx")
    fun getGdpStatisticalDataImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(GdpStatisticalDataExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("分市区基础数据明细导入模板.xlsx")
    }

    @Operation(summary = "批量导入分市区基础数据明细")
    //@SaCheckPermission("gdp-statistical-data::create")
    @PostMapping("import.xlsx")
    fun importGdpStatisticalData(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<GdpStatisticalDataExcelRow> =
                ExcelReadUtils.readFlux(tempFile, GdpStatisticalDataExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<GdpStatisticalDataExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toGdpStatisticalData().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(GdpStatisticalDataExcelRow::class)
                    .writeWith(createNewTempFile("xlsx")) { flux2 }
            }
            return ExcelImportResultVO(
                totalCount = totalCount,
                successCount = totalCount - failCount,
                failCount = failCount,
                result = file?.downloadVO("导入失败记录.xlsx")
            )
        } finally {
            tempFile.delete()
        }
    }

    @Operation(summary = "批量导出分市区基础数据明细")
    //@SaCheckPermission("gdp-statistical-data::query")
    @GetMapping("export.xlsx")
    fun exportGdpStatisticalData(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(GdpStatisticalDataVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<GdpStatisticalDataMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(GdpStatisticalDataVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("分市区基础数据明细导出.xlsx")
    }
}
