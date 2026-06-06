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
import com.tzdig.framework.model.dto.SystemWorkflowTransitionDTO
import com.tzdig.framework.model.dto.SystemWorkflowTransitionExcelRow
import com.tzdig.framework.model.qo.SystemWorkflowTransitionQO
import com.tzdig.framework.model.vo.SystemWorkflowTransitionVO
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowTransition
import com.tzdig.framework.mybatis.mapper.system.SystemWorkflowTransitionMapper
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
@RequestMapping("system-workflow-transition")
class SystemWorkflowTransitionController {
    @Operation(summary = "查询工作流流转配置列表")
    //@SaCheckPermission("system-workflow-transition::query")
    @GetMapping
    @PageableQuery
    fun listSystemWorkflowTransition(
        qo: SystemWorkflowTransitionQO,
        pageable: Pageable,
    ): PageableResult<SystemWorkflowTransitionVO> {
        val page = paginate<SystemWorkflowTransition>(pageable.pageNumber, pageable.pageSize) {
            queryWrapper(qo)
        }.map(::SystemWorkflowTransitionVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询工作流流转配置")
    //@SaCheckPermission("system-workflow-transition::query")
    @GetMapping("{id}")
    fun getSystemWorkflowTransition(
        @PathVariable id: String,
    ): SystemWorkflowTransitionVO {
        val record = queryOneById<SystemWorkflowTransition>(id)
            ?: throw NotFoundException("工作流流转配置不存在")
        return SystemWorkflowTransitionVO(record)
    }

    @Operation(summary = "创建工作流流转配置")
    //@SaCheckPermission("system-workflow-transition::create")
    @PostMapping
    fun createSystemWorkflowTransition(
        @RequestBody dto: SystemWorkflowTransitionDTO,
    ) {
        val cnt = queryCount<SystemWorkflowTransition> {
            and(SystemWorkflowTransition::workflowCode eq dto.workflowCode)
            and(SystemWorkflowTransition::currentNode eq dto.currentNode)
        }
        if (cnt > 0)
            throw ApiException("工作流节点不可重复配置")
        dto.toSystemWorkflowTransition().save()
    }

    @Operation(summary = "修改工作流流转配置")
    //@SaCheckPermission("system-workflow-transition::update")
    @PutMapping("{id}")
    fun updateSystemWorkflowTransition(
        @PathVariable id: String,
        @RequestBody dto: SystemWorkflowTransitionDTO,
    ) {
        val record = queryOneById<SystemWorkflowTransition>(id)
            ?: throw NotFoundException("工作流流转配置不存在")
        val cnt = queryCount<SystemWorkflowTransition> {
            and(SystemWorkflowTransition::id ne id)
            and(SystemWorkflowTransition::workflowCode eq dto.workflowCode)
            and(SystemWorkflowTransition::currentNode eq dto.currentNode)
        }
        if (cnt > 0)
            throw ApiException("工作流节点不可重复配置")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除工作流流转配置")
    //@SaCheckPermission("system-workflow-transition::delete")
    @DeleteMapping("{id}")
    fun deleteSystemWorkflowTransition(
        @PathVariable id: String,
    ) {
        val result = deleteById<SystemWorkflowTransition>(id)
        if (result == 0) throw NotFoundException("工作流流转配置不存在")
    }

    @Operation(summary = "工作流流转配置导入模板")
    //@SaCheckPermission("system-workflow-transition::create")
    @GetMapping("template.xlsx")
    fun getSystemWorkflowTransitionImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(SystemWorkflowTransitionExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("工作流流转配置导入模板.xlsx")
    }

    @Operation(summary = "批量导入工作流流转配置")
    //@SaCheckPermission("system-workflow-transition::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importSystemWorkflowTransition(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<SystemWorkflowTransitionExcelRow> =
                ExcelReadUtils.readFlux(tempFile, SystemWorkflowTransitionExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<SystemWorkflowTransitionExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toSystemWorkflowTransition().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(SystemWorkflowTransitionExcelRow::class)
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

    @Operation(summary = "批量导出工作流流转配置")
    //@SaCheckPermission("system-workflow-transition::query")
    @GetMapping("export.xlsx")
    fun exportSystemWorkflowTransition(
        qo: SystemWorkflowTransitionQO,
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val queryWrapper = QueryScope().apply { queryWrapper(qo) }
        val file = ExcelWriteUtils(SystemWorkflowTransitionVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<SystemWorkflowTransitionMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(SystemWorkflowTransitionVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("工作流流转配置导出.xlsx")
    }

    private fun QueryScope.queryWrapper(qo: SystemWorkflowTransitionQO) {
        // TODO
    }
}
