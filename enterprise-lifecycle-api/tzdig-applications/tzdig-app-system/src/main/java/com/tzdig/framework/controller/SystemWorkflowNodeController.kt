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
import com.tzdig.framework.model.dto.SystemWorkflowNodeDTO
import com.tzdig.framework.model.dto.SystemWorkflowNodeExcelRow
import com.tzdig.framework.model.qo.SystemWorkflowNodeQO
import com.tzdig.framework.model.vo.SystemWorkflowNodeVO
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowNode
import com.tzdig.framework.mybatis.mapper.system.SystemWorkflowNodeMapper
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
@RequestMapping("system-workflow-node")
class SystemWorkflowNodeController {
    @Operation(summary = "查询工作流节点列表")
    //@SaCheckPermission("system-workflow-node::query")
    @GetMapping
    @PageableQuery
    fun listSystemWorkflowNode(
        qo: SystemWorkflowNodeQO,
        pageable: Pageable,
    ): PageableResult<SystemWorkflowNodeVO> {
        val page = paginate<SystemWorkflowNode>(pageable.pageNumber, pageable.pageSize) {
            queryWrapper(qo)
        }.map(::SystemWorkflowNodeVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询工作流节点")
    //@SaCheckPermission("system-workflow-node::query")
    @GetMapping("{id}")
    fun getSystemWorkflowNode(
        @PathVariable id: String,
    ): SystemWorkflowNodeVO {
        val record = queryOneById<SystemWorkflowNode>(id)
            ?: throw NotFoundException("工作流节点不存在")
        return SystemWorkflowNodeVO(record)
    }

    @Operation(summary = "创建工作流节点")
    //@SaCheckPermission("system-workflow-node::create")
    @PostMapping
    fun createSystemWorkflowNode(
        @RequestBody dto: SystemWorkflowNodeDTO,
    ) {
        val cnt = queryCount<SystemWorkflowNode> {
            and(SystemWorkflowNode::workflowCode eq dto.workflowCode)
            and(SystemWorkflowNode::code eq dto.code)
        }
        if (cnt > 0)
            throw ApiException("工作流节点代码不可重复")
        dto.toSystemWorkflowNode().save()
    }

    @Operation(summary = "修改工作流节点")
    //@SaCheckPermission("system-workflow-node::update")
    @PutMapping("{id}")
    fun updateSystemWorkflowNode(
        @PathVariable id: String,
        @RequestBody dto: SystemWorkflowNodeDTO,
    ) {
        val record = queryOneById<SystemWorkflowNode>(id)
            ?: throw NotFoundException("工作流节点不存在")
        val cnt = queryCount<SystemWorkflowNode> {
            and(SystemWorkflowNode::id ne id)
            and(SystemWorkflowNode::workflowCode eq dto.workflowCode)
            and(SystemWorkflowNode::code eq dto.code)
        }
        if (cnt > 0)
            throw ApiException("工作流节点代码不可重复")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除工作流节点")
    //@SaCheckPermission("system-workflow-node::delete")
    @DeleteMapping("{id}")
    fun deleteSystemWorkflowNode(
        @PathVariable id: String,
    ) {
        val result = deleteById<SystemWorkflowNode>(id)
        if (result == 0) throw NotFoundException("工作流节点不存在")
    }

    @Operation(summary = "工作流节点导入模板")
    //@SaCheckPermission("system-workflow-node::create")
    @GetMapping("template.xlsx")
    fun getSystemWorkflowNodeImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(SystemWorkflowNodeExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("工作流节点导入模板.xlsx")
    }

    @Operation(summary = "批量导入工作流节点")
    //@SaCheckPermission("system-workflow-node::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importSystemWorkflowNode(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<SystemWorkflowNodeExcelRow> =
                ExcelReadUtils.readFlux(tempFile, SystemWorkflowNodeExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<SystemWorkflowNodeExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toSystemWorkflowNode().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(SystemWorkflowNodeExcelRow::class)
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

    @Operation(summary = "批量导出工作流节点")
    //@SaCheckPermission("system-workflow-node::query")
    @GetMapping("export.xlsx")
    fun exportSystemWorkflowNode(
        qo: SystemWorkflowNodeQO,
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val queryWrapper = QueryScope().apply { queryWrapper(qo) }
        val file = ExcelWriteUtils(SystemWorkflowNodeVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<SystemWorkflowNodeMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(SystemWorkflowNodeVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("工作流节点导出.xlsx")
    }

    private fun QueryScope.queryWrapper(qo: SystemWorkflowNodeQO) {
        // TODO
    }
}
