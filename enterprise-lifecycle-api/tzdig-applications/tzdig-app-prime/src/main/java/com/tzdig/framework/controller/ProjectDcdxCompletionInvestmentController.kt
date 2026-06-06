package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.isNull
import com.mybatisflex.kotlin.extensions.kproperty.ne
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectDcdxCompletionInvestmentDTO
import com.tzdig.framework.model.dto.ProjectDcdxCompletionInvestmentExcelRow
import com.tzdig.framework.model.vo.ProjectDcdxCompletionInvestmentVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxCompletionInvestment
import com.tzdig.framework.mybatis.mapper.prime.ProjectDcdxCompletionInvestmentMapper
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

@Tag(name = "达产达效-竣工项目及投资情况统计表管理")
@RestController
@RequestMapping("project-dcdx-completion-investment")
class ProjectDcdxCompletionInvestmentController {
    @Operation(summary = "查询达产达效-竣工项目及投资情况统计表列表")
    //@SaCheckPermission("project-dcdx-completion-investment::query")
    @GetMapping
    @PageableQuery
    fun listProjectDcdxCompletionInvestment(
        pageable: Pageable,
        @Schema(description = "市区")
        @RequestParam district: List<String>,
        @Schema(description = "园区查市区时传合计")
        @RequestParam park: List<String>,
        @Schema(description = "所属产业链群")
        @RequestParam industryGroup: List<String>,
    ): PageableResult<ProjectDcdxCompletionInvestmentVO> {
        val page = paginate<ProjectDcdxCompletionInvestment>(pageable.pageNumber, pageable.pageSize) {
            if (!district.isEmpty()) {
                and(ProjectDcdxCompletionInvestment::district inList district)
            }
            if (!park.isEmpty()) {
                and(ProjectDcdxCompletionInvestment::park inList park)
            } else {
                and(ProjectDcdxCompletionInvestment::park ne "合计")
            }
            if (!industryGroup.isEmpty()) {
                and(ProjectDcdxCompletionInvestment::industrialChainCluster inList industryGroup)
            }
            orderBy(ProjectDcdxCompletionInvestment::industrialChainCluster)
        }.map(::ProjectDcdxCompletionInvestmentVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询达产达效-竣工项目及投资情况统计表")
    //@SaCheckPermission("project-dcdx-completion-investment::query")
    @GetMapping("{id}")
    fun getProjectDcdxCompletionInvestment(
        @PathVariable id: String,
    ): ProjectDcdxCompletionInvestmentVO {
        val record = queryOneById<ProjectDcdxCompletionInvestment>(id)
            ?: throw NotFoundException("达产达效-竣工项目及投资情况统计表不存在")
        return ProjectDcdxCompletionInvestmentVO(record)
    }

    @Operation(summary = "创建达产达效-竣工项目及投资情况统计表")
    //@SaCheckPermission("project-dcdx-completion-investment::create")
    @PostMapping
    fun createProjectDcdxCompletionInvestment(
        @RequestBody dto: ProjectDcdxCompletionInvestmentDTO,
    ) {
        dto.toProjectDcdxCompletionInvestment().save()
    }

    @Operation(summary = "修改达产达效-竣工项目及投资情况统计表")
    //@SaCheckPermission("project-dcdx-completion-investment::update")
    @PutMapping("{id}")
    fun updateProjectDcdxCompletionInvestment(
        @PathVariable id: String,
        @RequestBody dto: ProjectDcdxCompletionInvestmentDTO,
    ) {
        val record = queryOneById<ProjectDcdxCompletionInvestment>(id)
            ?: throw NotFoundException("达产达效-竣工项目及投资情况统计表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除达产达效-竣工项目及投资情况统计表")
    //@SaCheckPermission("project-dcdx-completion-investment::delete")
    @DeleteMapping("{id}")
    fun deleteProjectDcdxCompletionInvestment(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectDcdxCompletionInvestment>(id)
        if (result == 0) throw NotFoundException("达产达效-竣工项目及投资情况统计表不存在")
    }

    @Operation(summary = "达产达效-竣工项目及投资情况统计表导入模板")
    //@SaCheckPermission("project-dcdx-completion-investment::create")
    @GetMapping("template.xlsx")
    fun getProjectDcdxCompletionInvestmentImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDcdxCompletionInvestmentExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("达产达效-竣工项目及投资情况统计表导入模板.xlsx")
    }

    @Operation(summary = "批量导入达产达效-竣工项目及投资情况统计表")
    //@SaCheckPermission("project-dcdx-completion-investment::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importProjectDcdxCompletionInvestment(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectDcdxCompletionInvestmentExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectDcdxCompletionInvestmentExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectDcdxCompletionInvestmentExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectDcdxCompletionInvestment().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectDcdxCompletionInvestmentExcelRow::class)
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

    @Operation(summary = "批量导出达产达效-竣工项目及投资情况统计表")
    //@SaCheckPermission("project-dcdx-completion-investment::query")
    @GetMapping("export.xlsx")
    fun exportProjectDcdxCompletionInvestment(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDcdxCompletionInvestmentVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectDcdxCompletionInvestmentMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectDcdxCompletionInvestmentVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("达产达效-竣工项目及投资情况统计表导出.xlsx")
    }

    @Operation(summary = "查询达产达效-竣工项目及投资情况统计表树")
    @GetMapping("tree")
    fun getProjectDcdxCompletionInvestmentTreeByIndustrialChain(): List<ProjectDcdxCompletionInvestmentVO> {
        val list = filter<ProjectDcdxCompletionInvestment> { ProjectDcdxCompletionInvestment::district.isNull }
            .map(::ProjectDcdxCompletionInvestmentVO)
        val map = list.associateBy {
            it.industrialChainCluster?.split('.')
        }
        for ((industrialChainCluster, item) in map) {
            if (industrialChainCluster == null) continue
            if (industrialChainCluster.last() != "0") {
                val parent = map[industrialChainCluster.dropLast(1) + "0"]
                parent?.children?.add(item)
            }
        }
        val result = list.filter { it.children.isNotEmpty() }
        result.forEach { parent -> parent.children.sortBy { it.industrialChainCluster } }
        return result.sortedBy { it.industrialChainCluster }
    }
}
