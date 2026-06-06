package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectDcdxEnterpriseCompletionStatsDTO
import com.tzdig.framework.model.dto.ProjectDcdxEnterpriseCompletionStatsExcelRow
import com.tzdig.framework.model.vo.ProjectDcdxEnterpriseCompletionStatsVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEnterpriseCompletionStats
import com.tzdig.framework.mybatis.mapper.prime.ProjectDcdxEnterpriseCompletionStatsMapper
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

@Tag(name = "达产达效-进规纳统企业统计表管理")
@RestController
@RequestMapping("project-dcdx-enterprise-completion-stats")
class ProjectDcdxEnterpriseCompletionStatsController {
    @Operation(summary = "查询达产达效-进规纳统企业统计表列表")
    //@SaCheckPermission("project-dcdx-enterprise-completion-stats::query")
    @GetMapping
    @PageableQuery
    fun listProjectDcdxEnterpriseCompletionStats(
        pageable: Pageable,
        @Schema(description = "市区")
        @RequestParam district: List<String>,
    ): PageableResult<ProjectDcdxEnterpriseCompletionStatsVO> {
        val page = paginate<ProjectDcdxEnterpriseCompletionStats>(pageable.pageNumber, pageable.pageSize) {
            if (!district.isEmpty()) and(ProjectDcdxEnterpriseCompletionStats::cityDistrict inList district)
        }.map(::ProjectDcdxEnterpriseCompletionStatsVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询达产达效-进规纳统企业统计表")
    //@SaCheckPermission("project-dcdx-enterprise-completion-stats::query")
    @GetMapping("{id}")
    fun getProjectDcdxEnterpriseCompletionStats(
        @PathVariable id: String,
    ): ProjectDcdxEnterpriseCompletionStatsVO {
        val record = queryOneById<ProjectDcdxEnterpriseCompletionStats>(id)
            ?: throw NotFoundException("达产达效-进规纳统企业统计表不存在")
        return ProjectDcdxEnterpriseCompletionStatsVO(record)
    }

    @Operation(summary = "创建达产达效-进规纳统企业统计表")
    //@SaCheckPermission("project-dcdx-enterprise-completion-stats::create")
    @PostMapping
    fun createProjectDcdxEnterpriseCompletionStats(
        @RequestBody dto: ProjectDcdxEnterpriseCompletionStatsDTO,
    ) {
        dto.toProjectDcdxEnterpriseCompletionStats().save()
    }

    @Operation(summary = "修改达产达效-进规纳统企业统计表")
    //@SaCheckPermission("project-dcdx-enterprise-completion-stats::update")
    @PutMapping("{id}")
    fun updateProjectDcdxEnterpriseCompletionStats(
        @PathVariable id: String,
        @RequestBody dto: ProjectDcdxEnterpriseCompletionStatsDTO,
    ) {
        val record = queryOneById<ProjectDcdxEnterpriseCompletionStats>(id)
            ?: throw NotFoundException("达产达效-进规纳统企业统计表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除达产达效-进规纳统企业统计表")
    //@SaCheckPermission("project-dcdx-enterprise-completion-stats::delete")
    @DeleteMapping("{id}")
    fun deleteProjectDcdxEnterpriseCompletionStats(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectDcdxEnterpriseCompletionStats>(id)
        if (result == 0) throw NotFoundException("达产达效-进规纳统企业统计表不存在")
    }

    @Operation(summary = "达产达效-进规纳统企业统计表导入模板")
    //@SaCheckPermission("project-dcdx-enterprise-completion-stats::create")
    @GetMapping("template.xlsx")
    fun getProjectDcdxEnterpriseCompletionStatsImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDcdxEnterpriseCompletionStatsExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("达产达效-进规纳统企业统计表导入模板.xlsx")
    }

    @Operation(summary = "批量导入达产达效-进规纳统企业统计表")
    //@SaCheckPermission("project-dcdx-enterprise-completion-stats::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importProjectDcdxEnterpriseCompletionStats(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectDcdxEnterpriseCompletionStatsExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectDcdxEnterpriseCompletionStatsExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectDcdxEnterpriseCompletionStatsExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectDcdxEnterpriseCompletionStats().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectDcdxEnterpriseCompletionStatsExcelRow::class)
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

    @Operation(summary = "批量导出达产达效-进规纳统企业统计表")
    //@SaCheckPermission("project-dcdx-enterprise-completion-stats::query")
    @GetMapping("export.xlsx")
    fun exportProjectDcdxEnterpriseCompletionStats(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDcdxEnterpriseCompletionStatsVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectDcdxEnterpriseCompletionStatsMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectDcdxEnterpriseCompletionStatsVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("达产达效-进规纳统企业统计表导出.xlsx")
    }
}
