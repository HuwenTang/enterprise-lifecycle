package com.tzdig.framework.controller

import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.scope.QueryScope
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.LhbForeignInvestmentProjectsDTO
import com.tzdig.framework.model.dto.LhbForeignInvestmentProjectsExcelRow
import com.tzdig.framework.model.qo.LhbForeignInvestmentProjectsQO
import com.tzdig.framework.model.vo.LhbForeignInvestmentProjectsVO
import com.tzdig.framework.mybatis.entity.prime.LhbForeignInvestmentProjects
import com.tzdig.framework.mybatis.mapper.prime.LhbForeignInvestmentProjectsMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "外资利润再投资项目统计表管理")
@RestController
@RequestMapping("lhb-foreign-investment-projects")
class LhbForeignInvestmentProjectsController {
    @Operation(summary = "查询外资利润再投资项目统计表列表")
    //@SaCheckPermission("lhb-foreign-investment-projects::query")
    @GetMapping
    @PageableQuery
    fun listLhbForeignInvestmentProjects(
        qo: LhbForeignInvestmentProjectsQO,
        pageable: Pageable,
    ): PageableResult<LhbForeignInvestmentProjectsVO> {
        val page = paginate<LhbForeignInvestmentProjects>(pageable.pageNumber, pageable.pageSize) {
            queryWrapper(qo)
        }.map(::LhbForeignInvestmentProjectsVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询外资利润再投资项目统计表")
    //@SaCheckPermission("lhb-foreign-investment-projects::query")
    @GetMapping("{id}")
    fun getLhbForeignInvestmentProjects(
        @PathVariable id: String,
    ): LhbForeignInvestmentProjectsVO {
        val record = queryOneById<LhbForeignInvestmentProjects>(id)
            ?: throw NotFoundException("外资利润再投资项目统计表不存在")
        return LhbForeignInvestmentProjectsVO(record)
    }

    @Operation(summary = "创建外资利润再投资项目统计表")
    //@SaCheckPermission("lhb-foreign-investment-projects::create")
    @PostMapping
    fun createLhbForeignInvestmentProjects(
        @RequestBody dto: LhbForeignInvestmentProjectsDTO,
    ) {
        dto.toLhbForeignInvestmentProjects().save()
    }

    @Operation(summary = "修改外资利润再投资项目统计表")
    //@SaCheckPermission("lhb-foreign-investment-projects::update")
    @PutMapping("{id}")
    fun updateLhbForeignInvestmentProjects(
        @PathVariable id: String,
        @RequestBody dto: LhbForeignInvestmentProjectsDTO,
    ) {
        val record = queryOneById<LhbForeignInvestmentProjects>(id)
            ?: throw NotFoundException("外资利润再投资项目统计表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除外资利润再投资项目统计表")
    //@SaCheckPermission("lhb-foreign-investment-projects::delete")
    @DeleteMapping("{id}")
    fun deleteLhbForeignInvestmentProjects(
        @PathVariable id: String,
    ) {
        val result = deleteById<LhbForeignInvestmentProjects>(id)
        if (result == 0) throw NotFoundException("外资利润再投资项目统计表不存在")
    }

    @Operation(summary = "外资利润再投资项目统计表导入模板")
    //@SaCheckPermission("lhb-foreign-investment-projects::create")
    @GetMapping("template.xlsx")
    fun getLhbForeignInvestmentProjectsImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(LhbForeignInvestmentProjectsExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("外资利润再投资项目统计表导入模板.xlsx")
    }

    @Operation(summary = "批量导入外资利润再投资项目统计表")
    //@SaCheckPermission("lhb-foreign-investment-projects::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importLhbForeignInvestmentProjects(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<LhbForeignInvestmentProjectsExcelRow> =
                ExcelReadUtils.readFlux(tempFile, LhbForeignInvestmentProjectsExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<LhbForeignInvestmentProjectsExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toLhbForeignInvestmentProjects().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(LhbForeignInvestmentProjectsExcelRow::class)
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

    @Operation(summary = "批量导出外资利润再投资项目统计表")
    //@SaCheckPermission("lhb-foreign-investment-projects::query")
    @GetMapping("export.xlsx")
    fun exportLhbForeignInvestmentProjects(
        qo: LhbForeignInvestmentProjectsQO,
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val queryWrapper = QueryScope().apply { queryWrapper(qo) }
        val file = ExcelWriteUtils(LhbForeignInvestmentProjectsVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<LhbForeignInvestmentProjectsMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(LhbForeignInvestmentProjectsVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("外资利润再投资项目统计表导出.xlsx")
    }

    private fun QueryScope.queryWrapper(qo: LhbForeignInvestmentProjectsQO) {
        // TODO
    }
}
