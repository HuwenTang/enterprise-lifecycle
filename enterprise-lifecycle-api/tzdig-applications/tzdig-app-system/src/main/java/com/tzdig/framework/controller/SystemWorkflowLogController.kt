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
import com.tzdig.framework.model.dto.SystemWorkflowLogDTO
import com.tzdig.framework.model.dto.SystemWorkflowLogExcelRow
import com.tzdig.framework.model.qo.SystemWorkflowLogQO
import com.tzdig.framework.model.vo.SystemWorkflowLogVO
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowLog
import com.tzdig.framework.mybatis.mapper.system.SystemWorkflowLogMapper
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

@Tag(name = "工作流管理")
@RestController
@RequestMapping("system-workflow-log")
class SystemWorkflowLogController {
    @Operation(summary = "查询工作流日志列表")
    //@SaCheckPermission("system-workflow-log::query")
    @GetMapping
    @PageableQuery
    fun listSystemWorkflowLog(
        qo: SystemWorkflowLogQO,
        pageable: Pageable,
    ): PageableResult<SystemWorkflowLogVO> {
        val page = paginate<SystemWorkflowLog>(pageable.pageNumber, pageable.pageSize) {
            queryWrapper(qo)
        }.map(::SystemWorkflowLogVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询工作流日志")
    //@SaCheckPermission("system-workflow-log::query")
    @GetMapping("{id}")
    fun getSystemWorkflowLog(
        @PathVariable id: String,
    ): SystemWorkflowLogVO {
        val record = queryOneById<SystemWorkflowLog>(id)
            ?: throw NotFoundException("工作流日志不存在")
        return SystemWorkflowLogVO(record)
    }

    @Operation(summary = "创建工作流日志")
    //@SaCheckPermission("system-workflow-log::create")
    @PostMapping
    fun createSystemWorkflowLog(
        @RequestBody dto: SystemWorkflowLogDTO,
    ) {
        dto.toSystemWorkflowLog().save()
    }

    @Operation(summary = "修改工作流日志")
    //@SaCheckPermission("system-workflow-log::update")
    @PutMapping("{id}")
    fun updateSystemWorkflowLog(
        @PathVariable id: String,
        @RequestBody dto: SystemWorkflowLogDTO,
    ) {
        val record = queryOneById<SystemWorkflowLog>(id)
            ?: throw NotFoundException("工作流日志不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除工作流日志")
    //@SaCheckPermission("system-workflow-log::delete")
    @DeleteMapping("{id}")
    fun deleteSystemWorkflowLog(
        @PathVariable id: String,
    ) {
        val result = deleteById<SystemWorkflowLog>(id)
        if (result == 0) throw NotFoundException("工作流日志不存在")
    }

    @Operation(summary = "工作流日志导入模板")
    //@SaCheckPermission("system-workflow-log::create")
    @GetMapping("template.xlsx")
    fun getSystemWorkflowLogImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(SystemWorkflowLogExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("工作流日志导入模板.xlsx")
    }

    @Operation(summary = "批量导入工作流日志")
    //@SaCheckPermission("system-workflow-log::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importSystemWorkflowLog(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<SystemWorkflowLogExcelRow> =
                ExcelReadUtils.readFlux(tempFile, SystemWorkflowLogExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<SystemWorkflowLogExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toSystemWorkflowLog().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(SystemWorkflowLogExcelRow::class)
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

    @Operation(summary = "批量导出工作流日志")
    //@SaCheckPermission("system-workflow-log::query")
    @GetMapping("export.xlsx")
    fun exportSystemWorkflowLog(
        qo: SystemWorkflowLogQO,
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val queryWrapper = QueryScope().apply { queryWrapper(qo) }
        val file = ExcelWriteUtils(SystemWorkflowLogVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<SystemWorkflowLogMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(SystemWorkflowLogVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("工作流日志导出.xlsx")
    }

    private fun QueryScope.queryWrapper(qo: SystemWorkflowLogQO) {
        // TODO
    }
}
