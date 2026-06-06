package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.query.RawQueryOrderBy
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.DigitalTaizhouDTO
import com.tzdig.framework.model.dto.DigitalTaizhouExcelRow
import com.tzdig.framework.model.vo.DigitalTaizhouVO
import com.tzdig.framework.mybatis.entity.prime.DigitalTaizhou
import com.tzdig.framework.mybatis.mapper.prime.DigitalTaizhouMapper
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "数据泰州总表管理")
@RestController
@RequestMapping("digital-taizhou")
class DigitalTaizhouController {
    @Operation(summary = "查询数据泰州总表列表")
    //@SaCheckPermission("digital-taizhou::query")
    @GetMapping
    @PageableQuery
    fun listDigitalTaizhou(
        @Schema(description = "指标大类")
        @RequestParam category: String,
        @Schema(description = "指标小类")
        @RequestParam subcategory: String,
    ): List<DigitalTaizhouVO> {
        val list = query<DigitalTaizhou> {
            select(
                DigitalTaizhou::year,
                DigitalTaizhou::quarter,
                DigitalTaizhou::cumulativeAbsoluteAmount,
                DigitalTaizhou::endOfPeriodValue,
                DigitalTaizhou::unit,
                DigitalTaizhou::cumulativeGrowthRate
            )
            where(DigitalTaizhou::indicatorCategory eq category)
            and(DigitalTaizhou::indicatorSubcategory eq subcategory)
            orderBy(DigitalTaizhou::year, false)
            orderBy(
                RawQueryOrderBy(
                    "CASE quarter " +
                            "WHEN '一季度' THEN 1 " +
                            "WHEN '二季度' THEN 2 " +
                            "WHEN '三季度' THEN 3 " +
                            "WHEN '四季度' THEN 4 " +
                            "ELSE 5 END DESC", false
                )
            )
        }.map(::DigitalTaizhouVO)
        return list
    }

    @Operation(summary = "查询数据泰州指标小类")
    //@SaCheckPermission("digital-taizhou::query")
    @GetMapping("subcategory")
    fun listDigitalTaizhou(
        @Schema(description = "指标大类")
        @RequestParam category: String,
    ): List<String?> {
        val records = query<DigitalTaizhou> {
            select(QueryMethods.distinct(DigitalTaizhou::indicatorSubcategory, DigitalTaizhou::sort))
            where(DigitalTaizhou::indicatorCategory eq category)
            orderBy(DigitalTaizhou::sort)

        }.map { it.indicatorSubcategory }
        return records
    }

    @Operation(summary = "查询数据泰州总表")
    //@SaCheckPermission("digital-taizhou::query")
    @GetMapping("{id}")
    fun getDigitalTaizhou(
        @PathVariable id: String,
    ): DigitalTaizhouVO {
        val record = queryOneById<DigitalTaizhou>(id)
            ?: throw NotFoundException("数据泰州总表不存在")
        return DigitalTaizhouVO(record)
    }

    @Operation(summary = "创建数据泰州总表")
    //@SaCheckPermission("digital-taizhou::create")
    @PostMapping
    fun createDigitalTaizhou(
        @RequestBody dto: DigitalTaizhouDTO,
    ) {
        dto.toDigitalTaizhou().save()
    }

    @Operation(summary = "修改数据泰州总表")
    //@SaCheckPermission("digital-taizhou::update")
    @PutMapping("{id}")
    fun updateDigitalTaizhou(
        @PathVariable id: String,
        @RequestBody dto: DigitalTaizhouDTO,
    ) {
        val record = queryOneById<DigitalTaizhou>(id)
            ?: throw NotFoundException("数据泰州总表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除数据泰州总表")
    //@SaCheckPermission("digital-taizhou::delete")
    @DeleteMapping("{id}")
    fun deleteDigitalTaizhou(
        @PathVariable id: String,
    ) {
        val result = deleteById<DigitalTaizhou>(id)
        if (result == 0) throw NotFoundException("数据泰州总表不存在")
    }

    @Operation(summary = "数据泰州总表导入模板")
    //@SaCheckPermission("digital-taizhou::create")
    @GetMapping("template.xlsx")
    fun getDigitalTaizhouImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(DigitalTaizhouExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("数据泰州总表导入模板.xlsx")
    }

    @Operation(summary = "批量导入数据泰州总表")
    //@SaCheckPermission("digital-taizhou::create")
    @PostMapping("import.xlsx")
    fun importDigitalTaizhou(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<DigitalTaizhouExcelRow> =
                ExcelReadUtils.readFlux(tempFile, DigitalTaizhouExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<DigitalTaizhouExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toDigitalTaizhou().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(DigitalTaizhouExcelRow::class)
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

    @Operation(summary = "批量导出数据泰州总表")
    //@SaCheckPermission("digital-taizhou::query")
    @GetMapping("export.xlsx")
    fun exportDigitalTaizhou(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(DigitalTaizhouVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<DigitalTaizhouMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(DigitalTaizhouVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("数据泰州总表导出.xlsx")
    }
}
