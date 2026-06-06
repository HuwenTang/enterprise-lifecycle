package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.ne
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectDcdxEconomicPerformanceStatsDTO
import com.tzdig.framework.model.dto.ProjectDcdxEconomicPerformanceStatsExcelRow
import com.tzdig.framework.model.vo.ProjectCompletedInfoVO
import com.tzdig.framework.model.vo.ProjectDcdxEconomicPerformanceStatsVO
import com.tzdig.framework.mybatis.entity.prime.ProjectCompletedInfo
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEconomicPerformanceStats
import com.tzdig.framework.mybatis.mapper.prime.ProjectDcdxEconomicPerformanceStatsMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
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

@Tag(name = "达产达效-产出效益表管理")
@RestController
@RequestMapping("project-dcdx-economic-performance-stats")
class ProjectDcdxEconomicPerformanceStatsController {
    @Operation(summary = "查询达产达效-产出效益表列表")
    //@SaCheckPermission("project-dcdx-economic-performance-stats::query")
    @GetMapping
    @PageableQuery
    fun listProjectDcdxEconomicPerformanceStats(
        @Schema(description = "年份")
        @RequestParam year: Int,
        @Schema(description = "市区")
        @RequestParam district: List<String>,
        @Schema(description = "园区查市区时传合计")
        @RequestParam park: List<String>,
        @Schema(description = "所属产业链群")
        @RequestParam industryGroup: List<String>,
    ): PageableResult<ProjectDcdxEconomicPerformanceStatsVO> {
        val page = paginate<ProjectDcdxEconomicPerformanceStats>(pageable.pageNumber, pageable.pageSize) {
            and(ProjectDcdxEconomicPerformanceStats::year eq year)
            if (district.isNotEmpty())
                and(ProjectDcdxEconomicPerformanceStats::district inList district)
            if (park.isEmpty()) {
                and(ProjectDcdxEconomicPerformanceStats::park ne "合计")
            } else {
                and(ProjectDcdxEconomicPerformanceStats::park inList park)
            }
            if (industryGroup.isNotEmpty())
                and(ProjectDcdxEconomicPerformanceStats::industrialChainCluster inList industryGroup)
            orderBy(ProjectDcdxEconomicPerformanceStats::industrialChainCluster)
        }.map(::ProjectDcdxEconomicPerformanceStatsVO)
        return PageableResult.of(page)
    }


    @Operation(summary = "查询竣工项目总表列表")
    //@SaCheckPermission("project-completed-info::query")
    @GetMapping("dcdx")
    @PageableQuery
    fun listDCDXInfo(
        pageable: Pageable,
        @Schema(description = "年份")
        @RequestParam(defaultValue = "2024") year: String,
        @Schema(description = "区域")
        @RequestParam(defaultValue = "泰州市") area: String,
    ): PageableResult<ProjectCompletedInfoVO> {
        val page = paginate<ProjectCompletedInfo>(pageable.pageNumber, pageable.pageSize) {
            and(ProjectCompletedInfo::year eq year)
            if (area != "泰州市")
                and(ProjectCompletedInfo::sector eq area)
        }.map(::ProjectCompletedInfoVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询达产达效-产出效益表")
    //@SaCheckPermission("project-dcdx-economic-performance-stats::query")
    @GetMapping("{id}")
    fun getProjectDcdxEconomicPerformanceStats(
        @PathVariable id: String,
    ): ProjectDcdxEconomicPerformanceStatsVO {
        val record = queryOneById<ProjectDcdxEconomicPerformanceStats>(id)
            ?: throw NotFoundException("达产达效-产出效益表不存在")
        return ProjectDcdxEconomicPerformanceStatsVO(record)
    }

    @Operation(summary = "创建达产达效-产出效益表")
    //@SaCheckPermission("project-dcdx-economic-performance-stats::create")
    @PostMapping
    fun createProjectDcdxEconomicPerformanceStats(
        @RequestBody dto: ProjectDcdxEconomicPerformanceStatsDTO,
    ) {
        dto.toProjectDcdxEconomicPerformanceStats().save()
    }

    @Operation(summary = "修改达产达效-产出效益表")
    //@SaCheckPermission("project-dcdx-economic-performance-stats::update")
    @PutMapping("{id}")
    fun updateProjectDcdxEconomicPerformanceStats(
        @PathVariable id: String,
        @RequestBody dto: ProjectDcdxEconomicPerformanceStatsDTO,
    ) {
        val record = queryOneById<ProjectDcdxEconomicPerformanceStats>(id)
            ?: throw NotFoundException("达产达效-产出效益表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除达产达效-产出效益表")
    //@SaCheckPermission("project-dcdx-economic-performance-stats::delete")
    @DeleteMapping("{id}")
    fun deleteProjectDcdxEconomicPerformanceStats(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectDcdxEconomicPerformanceStats>(id)
        if (result == 0) throw NotFoundException("达产达效-产出效益表不存在")
    }

    @Operation(summary = "达产达效-产出效益表导入模板")
    //@SaCheckPermission("project-dcdx-economic-performance-stats::create")
    @GetMapping("template.xlsx")
    fun getProjectDcdxEconomicPerformanceStatsImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDcdxEconomicPerformanceStatsExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("达产达效-产出效益表导入模板.xlsx")
    }

    @Operation(summary = "批量导入达产达效-产出效益表")
    //@SaCheckPermission("project-dcdx-economic-performance-stats::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importProjectDcdxEconomicPerformanceStats(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectDcdxEconomicPerformanceStatsExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectDcdxEconomicPerformanceStatsExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectDcdxEconomicPerformanceStatsExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectDcdxEconomicPerformanceStats().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectDcdxEconomicPerformanceStatsExcelRow::class)
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

    @Operation(summary = "批量导出达产达效-产出效益表")
    //@SaCheckPermission("project-dcdx-economic-performance-stats::query")
    @GetMapping("export.xlsx")
    fun exportProjectDcdxEconomicPerformanceStats(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDcdxEconomicPerformanceStatsVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectDcdxEconomicPerformanceStatsMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectDcdxEconomicPerformanceStatsVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("达产达效-产出效益表导出.xlsx")
    }
}
