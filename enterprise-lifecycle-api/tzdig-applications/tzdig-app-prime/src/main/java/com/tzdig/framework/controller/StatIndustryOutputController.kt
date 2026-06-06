package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.StatIndustryOutputDTO
import com.tzdig.framework.model.dto.StatIndustryOutputExcelRow
import com.tzdig.framework.model.vo.StatIndustryOutputVO
import com.tzdig.framework.mybatis.entity.prime.StatIndustryOutput
import com.tzdig.framework.mybatis.mapper.prime.StatIndustryOutputMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "链群产业体系产值管理")
@RestController
@RequestMapping("stat-industry-output")
class StatIndustryOutputController {
    @Operation(summary = "查询链群产业体系产值列表")
    //@SaCheckPermission("stat-industry-output::query")
    @GetMapping
    @PageableQuery
    fun listStatIndustryOutput(
        pageable: Pageable,
    ): PageableResult<StatIndustryOutputVO> {
        val page = paginate<StatIndustryOutput>(pageable.pageNumber, pageable.pageSize) {
            //TODO
        }.map(::StatIndustryOutputVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询链群产业体系产值")
    //@SaCheckPermission("stat-industry-output::query")
    @GetMapping("{id}")
    fun getStatIndustryOutput(
        @PathVariable id: String,
    ): StatIndustryOutputVO {
        val record = queryOneById<StatIndustryOutput>(id)
            ?: throw NotFoundException("链群产业体系产值不存在")
        return StatIndustryOutputVO(record)
    }

    @Operation(summary = "创建链群产业体系产值")
    //@SaCheckPermission("stat-industry-output::create")
    @PostMapping
    fun createStatIndustryOutput(
        @RequestBody dto: StatIndustryOutputDTO,
    ) {
        dto.toStatIndustryOutput().save()
    }

    @Operation(summary = "修改链群产业体系产值")
    //@SaCheckPermission("stat-industry-output::update")
    @PutMapping("{id}")
    fun updateStatIndustryOutput(
        @PathVariable id: String,
        @RequestBody dto: StatIndustryOutputDTO,
    ) {
        val record = queryOneById<StatIndustryOutput>(id)
            ?: throw NotFoundException("链群产业体系产值不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除链群产业体系产值")
    //@SaCheckPermission("stat-industry-output::delete")
    @DeleteMapping("{id}")
    fun deleteStatIndustryOutput(
        @PathVariable id: String,
    ) {
        val result = deleteById<StatIndustryOutput>(id)
        if (result == 0) throw NotFoundException("链群产业体系产值不存在")
    }

    @Operation(summary = "链群产业体系产值导入模板")
    //@SaCheckPermission("stat-industry-output::create")
    @GetMapping("template.xlsx")
    fun getStatIndustryOutputImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(StatIndustryOutputExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("链群产业体系产值导入模板.xlsx")
    }

    @Operation(summary = "批量导入链群产业体系产值")
    //@SaCheckPermission("stat-industry-output::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importStatIndustryOutput(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<StatIndustryOutputExcelRow> =
                ExcelReadUtils.readFlux(tempFile, StatIndustryOutputExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<StatIndustryOutputExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toStatIndustryOutput().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(StatIndustryOutputExcelRow::class)
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

    @Operation(summary = "批量导出链群产业体系产值")
    //@SaCheckPermission("stat-industry-output::query")
    @GetMapping("export.xlsx")
    fun exportStatIndustryOutput(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(StatIndustryOutputVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<StatIndustryOutputMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(StatIndustryOutputVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("链群产业体系产值导出.xlsx")
    }

    @Operation(summary = "查询链群产业体系产值树")
    @GetMapping("tree")
    fun getStatIndustryOutputTree(
        @Schema(description = "年份")
        @RequestParam year: Int,
        @Schema(description = "月份")
        @RequestParam month: Int,
    ): StatIndustryOutputVO? {
        val records = query<StatIndustryOutput> {
            and(StatIndustryOutput::year eq year)
            and(StatIndustryOutput::month eq month)
        }
            .map(::StatIndustryOutputVO)
        val map = records.associateBy { it.id }
        for (record in records) {
            if (record.id != record.parentIndicator)
                map[record.parentIndicator]?.children?.add(record)
        }
        return records.find { it.id == it.parentIndicator }
    }
}
