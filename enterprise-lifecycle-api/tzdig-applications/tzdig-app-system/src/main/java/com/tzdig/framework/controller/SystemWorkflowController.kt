package com.tzdig.framework.controller

import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.ne
import com.mybatisflex.kotlin.scope.QueryScope
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.SystemWorkflowDTO
import com.tzdig.framework.model.dto.SystemWorkflowExcelRow
import com.tzdig.framework.model.qo.SystemWorkflowQO
import com.tzdig.framework.model.vo.SystemWorkflowVO
import com.tzdig.framework.mybatis.entity.system.SystemWorkflow
import com.tzdig.framework.mybatis.mapper.system.SystemWorkflowMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.ApiException
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
@RequestMapping("system-workflow")
class SystemWorkflowController {
    @Operation(summary = "查询工作流列表")
    //@SaCheckPermission("system-workflow::query")
    @GetMapping
    @PageableQuery
    fun listSystemWorkflow(
        qo: SystemWorkflowQO,
        pageable: Pageable,
    ): PageableResult<SystemWorkflowVO> {
        val page = paginate<SystemWorkflow>(pageable.pageNumber, pageable.pageSize) {
            queryWrapper(qo)
        }.map(::SystemWorkflowVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询工作流")
    //@SaCheckPermission("system-workflow::query")
    @GetMapping("{id}")
    fun getSystemWorkflow(
        @PathVariable id: String,
    ): SystemWorkflowVO {
        val record = queryOneById<SystemWorkflow>(id)
            ?: throw NotFoundException("工作流不存在")
        return SystemWorkflowVO(record)
    }

    @Operation(summary = "创建工作流")
    //@SaCheckPermission("system-workflow::create")
    @PostMapping
    fun createSystemWorkflow(
        @RequestBody dto: SystemWorkflowDTO,
    ) {
        val cnt = queryCount<SystemWorkflow> {
            and(SystemWorkflow::code eq dto.code)
        }
        if (cnt > 0)
            throw ApiException("工作流代码不可重复")
        dto.toSystemWorkflow().save()
    }

    @Operation(summary = "修改工作流")
    //@SaCheckPermission("system-workflow::update")
    @PutMapping("{id}")
    fun updateSystemWorkflow(
        @PathVariable id: String,
        @RequestBody dto: SystemWorkflowDTO,
    ) {
        val record = queryOneById<SystemWorkflow>(id)
            ?: throw NotFoundException("工作流不存在")
        val cnt = queryCount<SystemWorkflow> {
            and(SystemWorkflow::id ne id)
            and(SystemWorkflow::code eq dto.code)
        }
        if (cnt > 0)
            throw ApiException("工作流代码不可重复")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除工作流")
    //@SaCheckPermission("system-workflow::delete")
    @DeleteMapping("{id}")
    fun deleteSystemWorkflow(
        @PathVariable id: String,
    ) {
        val result = deleteById<SystemWorkflow>(id)
        if (result == 0) throw NotFoundException("工作流不存在")
    }

    @Operation(summary = "工作流导入模板")
    //@SaCheckPermission("system-workflow::create")
    @GetMapping("template.xlsx")
    fun getSystemWorkflowImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(SystemWorkflowExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("工作流导入模板.xlsx")
    }

    @Operation(summary = "批量导入工作流")
    //@SaCheckPermission("system-workflow::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importSystemWorkflow(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<SystemWorkflowExcelRow> =
                ExcelReadUtils.readFlux(tempFile, SystemWorkflowExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<SystemWorkflowExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toSystemWorkflow().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(SystemWorkflowExcelRow::class)
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

    @Operation(summary = "批量导出工作流")
    //@SaCheckPermission("system-workflow::query")
    @GetMapping("export.xlsx")
    fun exportSystemWorkflow(
        qo: SystemWorkflowQO,
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val queryWrapper = QueryScope().apply { queryWrapper(qo) }
        val file = ExcelWriteUtils(SystemWorkflowVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<SystemWorkflowMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(SystemWorkflowVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("工作流导出.xlsx")
    }

    private fun QueryScope.queryWrapper(qo: SystemWorkflowQO) {
        // TODO
    }
}
