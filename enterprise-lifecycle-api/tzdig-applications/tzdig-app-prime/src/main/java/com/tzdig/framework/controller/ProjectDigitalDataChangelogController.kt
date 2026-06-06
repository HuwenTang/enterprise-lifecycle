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
import com.tzdig.framework.model.dto.ProjectDigitalDataChangelogDTO
import com.tzdig.framework.model.dto.ProjectDigitalDataChangelogExcelRow
import com.tzdig.framework.model.vo.ProjectDigitalDataChangelogVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalDataChangelog
import com.tzdig.framework.mybatis.mapper.prime.ProjectDigitalDataChangelogMapper
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

@Tag(name = "招商表字段变更记录管理")
@RestController
@RequestMapping("project-digital-data-changelog")
class ProjectDigitalDataChangelogController {
    @Operation(summary = "查询招商表字段变更记录列表")
    //@SaCheckPermission("project-digital-data-changelog::query")
    @GetMapping
    @PageableQuery
    fun listProjectDigitalDataChangelog(
        pageable: Pageable,
        @Schema(description = "表名（签约、开工）")
        @RequestParam(defaultValue = "") table: String?,
        @Schema(description = "id")
        @RequestParam(defaultValue = "") id: String?,
    ): PageableResult<ProjectDigitalDataChangelogVO> {
        val page = paginate<ProjectDigitalDataChangelog>(pageable.pageNumber, pageable.pageSize) {
            if (table == "签约") {
                and(ProjectDigitalDataChangelog::tableName eq "ext_zs_proj_project_signed")
            } else if (table == "开工") {
                and(ProjectDigitalDataChangelog::tableName eq "ext_zs_project_operation")
            }
            if (id != null) {
                and(ProjectDigitalDataChangelog::tableId eq id)
            }
        }.map(::ProjectDigitalDataChangelogVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询招商表字段变更记录")
    //@SaCheckPermission("project-digital-data-changelog::query")
    @GetMapping("{id}")
    fun getProjectDigitalDataChangelog(
        @PathVariable id: String,
    ): ProjectDigitalDataChangelogVO {
        val record = queryOneById<ProjectDigitalDataChangelog>(id)
            ?: throw NotFoundException("招商表字段变更记录不存在")
        return ProjectDigitalDataChangelogVO(record)
    }

    @Operation(summary = "创建招商表字段变更记录")
    //@SaCheckPermission("project-digital-data-changelog::create")
    @PostMapping
    fun createProjectDigitalDataChangelog(
        @RequestBody dto: ProjectDigitalDataChangelogDTO,
    ) {
        dto.toProjectDigitalDataChangelog().save()
    }

    @Operation(summary = "修改招商表字段变更记录")
    //@SaCheckPermission("project-digital-data-changelog::update")
    @PutMapping("{id}")
    fun updateProjectDigitalDataChangelog(
        @PathVariable id: String,
        @RequestBody dto: ProjectDigitalDataChangelogDTO,
    ) {
        val record = queryOneById<ProjectDigitalDataChangelog>(id)
            ?: throw NotFoundException("招商表字段变更记录不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除招商表字段变更记录")
    //@SaCheckPermission("project-digital-data-changelog::delete")
    @DeleteMapping("{id}")
    fun deleteProjectDigitalDataChangelog(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectDigitalDataChangelog>(id)
        if (result == 0) throw NotFoundException("招商表字段变更记录不存在")
    }

    @Operation(summary = "批量导入招商表字段变更记录")
    //@SaCheckPermission("project-digital-data-changelog::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importProjectDigitalDataChangelog(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectDigitalDataChangelogExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectDigitalDataChangelogExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectDigitalDataChangelogExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectDigitalDataChangelog().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectDigitalDataChangelogExcelRow::class)
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

    @Operation(summary = "批量导出招商表字段变更记录")
    //@SaCheckPermission("project-digital-data-changelog::query")
    @GetMapping("export.xlsx")
    fun exportProjectDigitalDataChangelog(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDigitalDataChangelogVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectDigitalDataChangelogMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectDigitalDataChangelogVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("招商表字段变更记录导出.xlsx")
    }
}
