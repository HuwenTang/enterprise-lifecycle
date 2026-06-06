package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.tzdig.framework.model.dto.GdpStatisticalDataRecordsDTO
import com.tzdig.framework.model.vo.GdpStatisticalDataRecordsVO
import com.tzdig.framework.mybatis.entity.prime.GdpStatisticalDataRecords
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "分市区基础数据记录管理")
@RestController
@RequestMapping("gdp-statistical-data-records")
class GdpStatisticalDataRecordsController {
    @Operation(summary = "查询分市区基础数据记录列表")
    //@SaCheckPermission("gdp-statistical-data-records::query")
    @GetMapping
    @PageableQuery
    fun listGdpStatisticalDataRecords(
        pageable: Pageable,
        @Schema(description = "统计名称")
        @RequestParam(required = false) statisticsName: String?,
        @Schema(description = "数据来源")
        @RequestParam(required = false) dataSource: String?,
        @Schema(description = "年份")
        @RequestParam(required = false) year: Int?,
    ): PageableResult<GdpStatisticalDataRecordsVO> {
        val page = paginate<GdpStatisticalDataRecords>(pageable.pageNumber, pageable.pageSize) {
            where(GdpStatisticalDataRecords::statisticsName like statisticsName)
            and(GdpStatisticalDataRecords::dataSource like dataSource)
            if (year != null) and(GdpStatisticalDataRecords::year eq year)
        }.map(::GdpStatisticalDataRecordsVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询分市区基础数据记录")
    //@SaCheckPermission("gdp-statistical-data-records::query")
    @GetMapping("{id}")
    fun getGdpStatisticalDataRecords(
        @PathVariable id: String,
    ): GdpStatisticalDataRecordsVO {
        val record = queryOneById<GdpStatisticalDataRecords>(id)
            ?: throw NotFoundException("分市区基础数据记录不存在")
        return GdpStatisticalDataRecordsVO(record)
    }

    @Operation(summary = "创建分市区基础数据记录")
    //@SaCheckPermission("gdp-statistical-data-records::create")
    @PostMapping
    fun createGdpStatisticalDataRecords(
        @RequestBody dto: GdpStatisticalDataRecordsDTO,
    ) {
        dto.toGdpStatisticalDataRecords().save()
    }

    @Operation(summary = "修改分市区基础数据记录")
    //@SaCheckPermission("gdp-statistical-data-records::update")
    @PutMapping("{id}")
    fun updateGdpStatisticalDataRecords(
        @PathVariable id: String,
        @RequestBody dto: GdpStatisticalDataRecordsDTO,
    ) {
        val record = queryOneById<GdpStatisticalDataRecords>(id)
            ?: throw NotFoundException("分市区基础数据记录不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除分市区基础数据记录")
    //@SaCheckPermission("gdp-statistical-data-records::delete")
    @DeleteMapping("{id}")
    fun deleteGdpStatisticalDataRecords(
        @PathVariable id: String,
    ) {
        val result = deleteById<GdpStatisticalDataRecords>(id)
        if (result == 0) throw NotFoundException("分市区基础数据记录不存在")
    }

    /* @Operation(summary = "分市区基础数据记录导入模板")
     //@SaCheckPermission("gdp-statistical-data-records::create")
     @GetMapping("template.xlsx")
     fun getGdpStatisticalDataRecordsImportTemplate(): FileDownloadVO {
         val file = ExcelWriteUtils(GdpStatisticalDataRecordsExcelRow::class)
             .writeTemplate(createNewTempFile("xlsx"), emptyMap(*//*TODO*//*))
        return file.downloadVO("分市区基础数据记录导入模板.xlsx")
    }*/

    /* @Operation(summary = "批量导入分市区基础数据记录")
     //@SaCheckPermission("gdp-statistical-data-records::create")
     @PostMapping("import.xlsx")
     fun importGdpStatisticalDataRecords(
         @RequestPart file: MultipartFile,
     ): ExcelImportResultVO {
         val tempFile = file.tempFile(".xlsx")
         try {
             val flux1: Flux<GdpStatisticalDataRecordsExcelRow> =
                 ExcelReadUtils.readFlux(tempFile, GdpStatisticalDataRecordsExcelRow::class)
             val totalCount = flux1.count().block() ?: 0
             val flux2: Flux<GdpStatisticalDataRecordsExcelRow> = flux1.mapNotNull {
                 try {
                     it.verify()
                     it.toGdpStatisticalDataRecords().save()
                     null
                 } catch (e: IllegalArgumentException) {
                     it.failReason = e.message
                     it
                 }
             }
             val failCount = flux2.count().block() ?: 0
             val file = if (failCount == 0L) null else {
                 ExcelWriteUtils(GdpStatisticalDataRecordsExcelRow::class)
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
     }*/

    /* @Operation(summary = "批量导出分市区基础数据记录")
     //@SaCheckPermission("gdp-statistical-data-records::query")
     @GetMapping("export.xlsx")
     fun exportGdpStatisticalDataRecords(
         @RequestParam(defaultValue = "") fields: Set<String>,
     ): FileDownloadVO {
         val file = ExcelWriteUtils(GdpStatisticalDataRecordsVO::class)
             .writeWith(createNewTempFile("xlsx"), fields) {
                 val mapper = mapper<GdpStatisticalDataRecordsMapper>()
                 Flux.create { emitter ->
                     Db.tx {
                         val records = mapper.selectCursorByQuery(QueryWrapper())
                         for (record in records) emitter.next(GdpStatisticalDataRecordsVO(record))
                         emitter.complete()
                         true
                     }
                 }
             }
         return file.downloadVO("分市区基础数据记录导出.xlsx")
     }*/
}
