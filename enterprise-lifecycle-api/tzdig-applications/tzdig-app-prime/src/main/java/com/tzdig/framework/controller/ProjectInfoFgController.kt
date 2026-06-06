package com.tzdig.framework.controller

import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.mybatisflex.kotlin.scope.QueryScope
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectInfoFgDTO
import com.tzdig.framework.model.dto.ProjectInfoFgExcelRow
import com.tzdig.framework.model.qo.ProjectInfoFgQO
import com.tzdig.framework.model.vo.ProjectInfoFgVO
import com.tzdig.framework.mybatis.entity.prime.ProjectInfoFg
import com.tzdig.framework.mybatis.mapper.prime.ProjectInfoFgMapper
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

@Tag(name = "发改项目管理表管理")
@RestController
@RequestMapping("project-info-fg")
class ProjectInfoFgController {
    @Operation(summary = "查询发改项目管理表列表")
    //@SaCheckPermission("project-info-fg::query")
    @GetMapping
    @PageableQuery
    fun listProjectInfoFg(
        qo: ProjectInfoFgQO,
        pageable: Pageable,
    ): PageableResult<ProjectInfoFgVO> {
        val page = paginate<ProjectInfoFg>(pageable.pageNumber, pageable.pageSize) {
            queryWrapper(qo)
        }.map(::ProjectInfoFgVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询发改项目管理表")
    //@SaCheckPermission("project-info-fg::query")
    @GetMapping("{id}")
    fun getProjectInfoFg(
        @PathVariable id: String,
    ): ProjectInfoFgVO {
        val record = queryOneById<ProjectInfoFg>(id)
            ?: throw NotFoundException("发改项目管理表不存在")
        return ProjectInfoFgVO(record)
    }

    @Operation(summary = "创建发改项目管理表")
    //@SaCheckPermission("project-info-fg::create")
    @PostMapping
    fun createProjectInfoFg(
        @RequestBody dto: ProjectInfoFgDTO,
    ) {
        dto.toProjectInfoFg().save()
    }

    @Operation(summary = "修改发改项目管理表")
    //@SaCheckPermission("project-info-fg::update")
    @PutMapping("{id}")
    fun updateProjectInfoFg(
        @PathVariable id: String,
        @RequestBody dto: ProjectInfoFgDTO,
    ) {
        val record = queryOneById<ProjectInfoFg>(id)
            ?: throw NotFoundException("发改项目管理表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除发改项目管理表")
    //@SaCheckPermission("project-info-fg::delete")
    @DeleteMapping("{id}")
    fun deleteProjectInfoFg(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectInfoFg>(id)
        if (result == 0) throw NotFoundException("发改项目管理表不存在")
    }

    @Operation(summary = "发改项目管理表导入模板")
    //@SaCheckPermission("project-info-fg::create")
    @GetMapping("template.xlsx")
    fun getProjectInfoFgImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectInfoFgExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("发改项目管理表导入模板.xlsx")
    }

    @Operation(summary = "批量导入发改项目管理表")
    //@SaCheckPermission("project-info-fg::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importProjectInfoFg(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectInfoFgExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectInfoFgExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectInfoFgExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectInfoFg().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectInfoFgExcelRow::class)
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

    @Operation(summary = "批量导出发改项目管理表")
    //@SaCheckPermission("project-info-fg::query")
    @GetMapping("export.xlsx")
    fun exportProjectInfoFg(
        qo: ProjectInfoFgQO,
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val queryWrapper = QueryScope().apply { queryWrapper(qo) }
        val file = ExcelWriteUtils(ProjectInfoFgVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectInfoFgMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(queryWrapper)
                        for (record in records) emitter.next(ProjectInfoFgVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("市重点项目导出.xlsx")
    }

    private fun QueryScope.queryWrapper(qo: ProjectInfoFgQO) {
        if (qo.city != null) {
            if (qo.city != "321200000000") {
                val cityName = AreaConstant.DISTRICT_LIST.find { it.first == qo.city }?.second
                and(ProjectInfoFg::responsibleUnit like cityName)
            }
        }
        if (qo.isNewStart != null) {
            and(ProjectInfoFg::isNewStart eq qo.isNewStart)
        }
    }
}
