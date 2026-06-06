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
import com.tzdig.framework.model.dto.LhbMajorProjectStatusDTO
import com.tzdig.framework.model.dto.LhbMajorProjectStatusExcelRow
import com.tzdig.framework.model.qo.LhbMajorProjectStatusQO
import com.tzdig.framework.model.vo.LhbMajorProjectStatusVO
import com.tzdig.framework.mybatis.entity.prime.LhbMajorProjectStatus
import com.tzdig.framework.mybatis.mapper.prime.LhbMajorProjectStatusMapper
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

@Tag(name = "省重大项目情况统计表管理")
@RestController
@RequestMapping("lhb-major-project-status")
class LhbMajorProjectStatusController {
    @Operation(summary = "查询省重大项目情况统计表列表")
    //@SaCheckPermission("lhb-major-project-status::query")
    @GetMapping
    @PageableQuery
    fun listLhbMajorProjectStatus(
        qo: LhbMajorProjectStatusQO,
        pageable: Pageable,
    ): PageableResult<LhbMajorProjectStatusVO> {
        val page = paginate<LhbMajorProjectStatus>(pageable.pageNumber, pageable.pageSize) {
            queryWrapper(qo)
        }.map(::LhbMajorProjectStatusVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询省重大项目情况统计表")
    //@SaCheckPermission("lhb-major-project-status::query")
    @GetMapping("{id}")
    fun getLhbMajorProjectStatus(
        @PathVariable id: String,
    ): LhbMajorProjectStatusVO {
        val record = queryOneById<LhbMajorProjectStatus>(id)
            ?: throw NotFoundException("省重大项目情况统计表不存在")
        return LhbMajorProjectStatusVO(record)
    }

    @Operation(summary = "创建省重大项目情况统计表")
    //@SaCheckPermission("lhb-major-project-status::create")
    @PostMapping
    fun createLhbMajorProjectStatus(
        @RequestBody dto: LhbMajorProjectStatusDTO,
    ) {
        dto.toLhbMajorProjectStatus().save()
    }

    @Operation(summary = "修改省重大项目情况统计表")
    //@SaCheckPermission("lhb-major-project-status::update")
    @PutMapping("{id}")
    fun updateLhbMajorProjectStatus(
        @PathVariable id: String,
        @RequestBody dto: LhbMajorProjectStatusDTO,
    ) {
        val record = queryOneById<LhbMajorProjectStatus>(id)
            ?: throw NotFoundException("省重大项目情况统计表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除省重大项目情况统计表")
    //@SaCheckPermission("lhb-major-project-status::delete")
    @DeleteMapping("{id}")
    fun deleteLhbMajorProjectStatus(
        @PathVariable id: String,
    ) {
        val result = deleteById<LhbMajorProjectStatus>(id)
        if (result == 0) throw NotFoundException("省重大项目情况统计表不存在")
    }

    @Operation(summary = "省重大项目情况统计表导入模板")
    //@SaCheckPermission("lhb-major-project-status::create")
    @GetMapping("template.xlsx")
    fun getLhbMajorProjectStatusImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(LhbMajorProjectStatusExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("省重大项目情况统计表导入模板.xlsx")
    }

    @Operation(summary = "批量导入省重大项目情况统计表")
    //@SaCheckPermission("lhb-major-project-status::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importLhbMajorProjectStatus(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<LhbMajorProjectStatusExcelRow> =
                ExcelReadUtils.readFlux(tempFile, LhbMajorProjectStatusExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<LhbMajorProjectStatusExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toLhbMajorProjectStatus().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(LhbMajorProjectStatusExcelRow::class)
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

    @Operation(summary = "批量导出省重大项目情况统计表")
    //@SaCheckPermission("lhb-major-project-status::query")
    @GetMapping("export.xlsx")
    fun exportLhbMajorProjectStatus(
        qo: LhbMajorProjectStatusQO,
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val queryWrapper = QueryScope().apply { queryWrapper(qo) }
        val file = ExcelWriteUtils(LhbMajorProjectStatusVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<LhbMajorProjectStatusMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(LhbMajorProjectStatusVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("省重大项目情况统计表导出.xlsx")
    }

    private fun QueryScope.queryWrapper(qo: LhbMajorProjectStatusQO) {
        // TODO
    }
}
