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
import com.tzdig.framework.model.dto.ProjectDcdxEnterpriseCompletionDTO
import com.tzdig.framework.model.dto.ProjectDcdxEnterpriseCompletionExcelRow
import com.tzdig.framework.model.vo.ProjectDcdxEnterpriseCompletionVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEnterpriseCompletion
import com.tzdig.framework.mybatis.mapper.prime.ProjectDcdxEnterpriseCompletionMapper
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

@Tag(name = "达产达效-进规纳统企业表管理")
@RestController
@RequestMapping("project-dcdx-enterprise-completion")
class ProjectDcdxEnterpriseCompletionController {
    @Operation(summary = "查询达产达效-进规纳统企业表列表")
    //@SaCheckPermission("project-dcdx-enterprise-completion::query")
    @GetMapping
    @PageableQuery
    fun listProjectDcdxEnterpriseCompletion(
        pageable: Pageable,
        @Schema(description = "地区")
        @RequestParam district: String?,
        @Schema(description = "是否已进规企业")
        @RequestParam isJG: Boolean?,
        @Schema(description = "是否已预估进规纳统企业")
        @RequestParam isYGJG: Boolean?,
    ): PageableResult<ProjectDcdxEnterpriseCompletionVO> {
        val page = paginate<ProjectDcdxEnterpriseCompletion>(pageable.pageNumber, pageable.pageSize) {
            if (district != null) {
                and(ProjectDcdxEnterpriseCompletion::district eq district)
            }
            if (isJG != null) {
                and(ProjectDcdxEnterpriseCompletion::isJgEnterprise eq isJG)
            }
            if (isYGJG != null) {
                and(ProjectDcdxEnterpriseCompletion::isYgjgEnterprise eq isYGJG)
            }
        }.map(::ProjectDcdxEnterpriseCompletionVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询达产达效-进规纳统企业表")
    //@SaCheckPermission("project-dcdx-enterprise-completion::query")
    @GetMapping("{id}")
    fun getProjectDcdxEnterpriseCompletion(
        @PathVariable id: String,
    ): ProjectDcdxEnterpriseCompletionVO {
        val record = queryOneById<ProjectDcdxEnterpriseCompletion>(id)
            ?: throw NotFoundException("达产达效-进规纳统企业表不存在")
        return ProjectDcdxEnterpriseCompletionVO(record)
    }

    @Operation(summary = "创建达产达效-进规纳统企业表")
    //@SaCheckPermission("project-dcdx-enterprise-completion::create")
    @PostMapping
    fun createProjectDcdxEnterpriseCompletion(
        @RequestBody dto: ProjectDcdxEnterpriseCompletionDTO,
    ) {
        dto.toProjectDcdxEnterpriseCompletion().save()
    }

    @Operation(summary = "修改达产达效-进规纳统企业表")
    //@SaCheckPermission("project-dcdx-enterprise-completion::update")
    @PutMapping("{id}")
    fun updateProjectDcdxEnterpriseCompletion(
        @PathVariable id: String,
        @RequestBody dto: ProjectDcdxEnterpriseCompletionDTO,
    ) {
        val record = queryOneById<ProjectDcdxEnterpriseCompletion>(id)
            ?: throw NotFoundException("达产达效-进规纳统企业表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除达产达效-进规纳统企业表")
    //@SaCheckPermission("project-dcdx-enterprise-completion::delete")
    @DeleteMapping("{id}")
    fun deleteProjectDcdxEnterpriseCompletion(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectDcdxEnterpriseCompletion>(id)
        if (result == 0) throw NotFoundException("达产达效-进规纳统企业表不存在")
    }

    @Operation(summary = "达产达效-进规纳统企业表导入模板")
    //@SaCheckPermission("project-dcdx-enterprise-completion::create")
    @GetMapping("template.xlsx")
    fun getProjectDcdxEnterpriseCompletionImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDcdxEnterpriseCompletionExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("达产达效-进规纳统企业表导入模板.xlsx")
    }

    @Operation(summary = "批量导入达产达效-进规纳统企业表")
    //@SaCheckPermission("project-dcdx-enterprise-completion::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importProjectDcdxEnterpriseCompletion(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectDcdxEnterpriseCompletionExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectDcdxEnterpriseCompletionExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectDcdxEnterpriseCompletionExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectDcdxEnterpriseCompletion().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectDcdxEnterpriseCompletionExcelRow::class)
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

    @Operation(summary = "批量导出达产达效-进规纳统企业表")
    //@SaCheckPermission("project-dcdx-enterprise-completion::query")
    @GetMapping("export.xlsx")
    fun exportProjectDcdxEnterpriseCompletion(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDcdxEnterpriseCompletionVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectDcdxEnterpriseCompletionMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectDcdxEnterpriseCompletionVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("达产达效-进规纳统企业表导出.xlsx")
    }
}
