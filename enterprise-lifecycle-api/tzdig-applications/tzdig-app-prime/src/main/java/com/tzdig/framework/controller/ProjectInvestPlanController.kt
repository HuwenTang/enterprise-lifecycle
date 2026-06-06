package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectInvestPlanDTO
import com.tzdig.framework.model.dto.ProjectInvestPlanExcelRow
import com.tzdig.framework.model.vo.ProjectInvestPlanVO
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestPlan
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
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

@Tag(name = "项目计划投资情况管理")
@RestController
@RequestMapping("project-invest-plan")
class ProjectInvestPlanController {
    @Operation(summary = "查询项目计划投资情况列表")
    //@SaCheckPermission("project-invest-plan::query")
    @GetMapping
    @PageableQuery
    fun listProjectInvestPlan(
        //TODO
    ): PageableResult<ProjectInvestPlanVO> {
        val page = paginate<ProjectInvestPlan>(pageable.pageNumber, pageable.pageSize) {
        }.map(::ProjectInvestPlanVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询项目计划投资情况")
    //@SaCheckPermission("project-invest-plan::query")
    @GetMapping("{id}")
    fun getProjectInvestPlan(
        @PathVariable id: String,
    ): ProjectInvestPlanVO {
        val record = queryOneById<ProjectInvestPlan>(id)
            ?: throw NotFoundException("项目计划投资情况不存在")
        return ProjectInvestPlanVO(record)
    }

    @Operation(summary = "创建项目计划投资情况")
    //@SaCheckPermission("project-invest-plan::create")
    @PostMapping
    fun createProjectInvestPlan(
        @RequestBody dto: ProjectInvestPlanDTO,
    ) {
        dto.toProjectInvestPlan().save()
    }

    @Operation(summary = "修改项目计划投资情况")
    //@SaCheckPermission("project-invest-plan::update")
    @PutMapping("{id}")
    fun updateProjectInvestPlan(
        @PathVariable id: String,
        @RequestBody dto: ProjectInvestPlanDTO,
    ) {
        val record = queryOneById<ProjectInvestPlan>(id)
            ?: throw NotFoundException("项目计划投资情况不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除项目计划投资情况")
    //@SaCheckPermission("project-invest-plan::delete")
    @DeleteMapping("{id}")
    fun deleteProjectInvestPlan(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectInvestPlan>(id)
        if (result == 0) throw NotFoundException("项目计划投资情况不存在")
    }

//    @Operation(summary = "项目计划投资情况导入模板")
//    //@SaCheckPermission("project-invest-plan::create")
//    @GetMapping("template.xlsx")
//    fun getProjectInvestPlanImportTemplate(): FileDownloadVO {
//        val file = ExcelWriteUtils(ProjectInvestPlanExcelRow::class)
//            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
//        return file.downloadVO("项目计划投资情况导入模板.xlsx")
//    }

    @Operation(summary = "批量导入项目计划投资情况")
    //@SaCheckPermission("project-invest-plan::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importProjectInvestPlan(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectInvestPlanExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectInvestPlanExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectInvestPlanExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectInvestPlan().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectInvestPlanExcelRow::class)
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

//    @Operation(summary = "批量导出项目计划投资情况")
//    //@SaCheckPermission("project-invest-plan::query")
//    @GetMapping("export.xlsx")
//    fun exportProjectInvestPlan(
//        @RequestParam(defaultValue = "") fields: Set<String>,
//    ): FileDownloadVO {
//        val queryWrapper = with(QueryScope()) {
//        }
//        val file = ExcelWriteUtils(ProjectInvestPlanVO::class)
//            .writeWith(createNewTempFile("xlsx"), fields) {
//                val mapper = mapper<ProjectInvestPlanMapper>()
//                Flux.create { emitter ->
//                    Db.tx {
//                        val records = mapper.selectCursorByQuery(queryWrapper)
//                        for (record in records) emitter.next(ProjectInvestPlanVO(record))
//                        emitter.complete()
//                        true
//                    }
//                }
//            }
//        return file.downloadVO("项目计划投资情况导出.xlsx")
//    }
}
