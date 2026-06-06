package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectDcdxChainClusterPerformanceDTO
import com.tzdig.framework.model.dto.ProjectDcdxChainClusterPerformanceExcelRow
import com.tzdig.framework.model.vo.ProjectDcdxChainClusterPerformanceVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxChainClusterPerformance
import com.tzdig.framework.mybatis.entity.system.SystemDict
import com.tzdig.framework.mybatis.mapper.prime.ProjectDcdxChainClusterPerformanceMapper
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

@Tag(name = "达产达效-链群体系个性化数据统计表管理")
@RestController
@RequestMapping("project-dcdx-chain-cluster-performance")
class ProjectDcdxChainClusterPerformanceController {
    @Operation(summary = "查询达产达效-链群体系个性化数据统计表列表")
    //@SaCheckPermission("project-dcdx-chain-cluster-performance::query")
    @GetMapping
    @PageableQuery
    fun listProjectDcdxChainClusterPerformance(
        pageable: Pageable,
        @Schema(description = "市区")
        @RequestParam district: List<String>,
        @Schema(description = "园区查市区时传合计")
        @RequestParam park: List<String>,
        @Schema(description = "所属产业链群")
        @RequestParam industryGroup: List<String>,
    ): PageableResult<ProjectDcdxChainClusterPerformanceVO> {
        val page = paginate<ProjectDcdxChainClusterPerformance>(pageable.pageNumber, pageable.pageSize) {
            if (!district.isEmpty()) {
                and(ProjectDcdxChainClusterPerformance::district inList district)
            }
            if (!park.isEmpty()) {
                and(ProjectDcdxChainClusterPerformance::park inList park)
            }
            if (!industryGroup.isEmpty()) {
                and(ProjectDcdxChainClusterPerformance::industrialChainCluster inList industryGroup)
            }
            orderBy(ProjectDcdxChainClusterPerformance::industrialChainCluster)
        }.map(::ProjectDcdxChainClusterPerformanceVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询链群列表", deprecated = true)
    @GetMapping("industry-group")
    fun listIndustryGroup() = filter<SystemDict> {
        SystemDict::catalog eq "8_13_X"
    }.map {
        mapOf("value" to it.code!!, "key" to it.label!!)
    }

    @Operation(summary = "查询达产达效-链群体系个性化数据统计表")
    //@SaCheckPermission("project-dcdx-chain-cluster-performance::query")
    @GetMapping("{id}")
    fun getProjectDcdxChainClusterPerformance(
        @PathVariable id: String,
    ): ProjectDcdxChainClusterPerformanceVO {
        val record = queryOneById<ProjectDcdxChainClusterPerformance>(id)
            ?: throw NotFoundException("达产达效-链群体系个性化数据统计表不存在")
        return ProjectDcdxChainClusterPerformanceVO(record)
    }

    @Operation(summary = "创建达产达效-链群体系个性化数据统计表")
    //@SaCheckPermission("project-dcdx-chain-cluster-performance::create")
    @PostMapping
    fun createProjectDcdxChainClusterPerformance(
        @RequestBody dto: ProjectDcdxChainClusterPerformanceDTO,
    ) {
        dto.toProjectDcdxChainClusterPerformance().save()
    }

    @Operation(summary = "修改达产达效-链群体系个性化数据统计表")
    //@SaCheckPermission("project-dcdx-chain-cluster-performance::update")
    @PutMapping("{id}")
    fun updateProjectDcdxChainClusterPerformance(
        @PathVariable id: String,
        @RequestBody dto: ProjectDcdxChainClusterPerformanceDTO,
    ) {
        val record = queryOneById<ProjectDcdxChainClusterPerformance>(id)
            ?: throw NotFoundException("达产达效-链群体系个性化数据统计表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除达产达效-链群体系个性化数据统计表")
    //@SaCheckPermission("project-dcdx-chain-cluster-performance::delete")
    @DeleteMapping("{id}")
    fun deleteProjectDcdxChainClusterPerformance(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectDcdxChainClusterPerformance>(id)
        if (result == 0) throw NotFoundException("达产达效-链群体系个性化数据统计表不存在")
    }

    @Operation(summary = "达产达效-链群体系个性化数据统计表导入模板")
    //@SaCheckPermission("project-dcdx-chain-cluster-performance::create")
    @GetMapping("template.xlsx")
    fun getProjectDcdxChainClusterPerformanceImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDcdxChainClusterPerformanceExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("达产达效-链群体系个性化数据统计表导入模板.xlsx")
    }

    @Operation(summary = "批量导入达产达效-链群体系个性化数据统计表")
    //@SaCheckPermission("project-dcdx-chain-cluster-performance::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importProjectDcdxChainClusterPerformance(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectDcdxChainClusterPerformanceExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectDcdxChainClusterPerformanceExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectDcdxChainClusterPerformanceExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectDcdxChainClusterPerformance().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectDcdxChainClusterPerformanceExcelRow::class)
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

    @Operation(summary = "批量导出达产达效-链群体系个性化数据统计表")
    //@SaCheckPermission("project-dcdx-chain-cluster-performance::query")
    @GetMapping("export.xlsx")
    fun exportProjectDcdxChainClusterPerformance(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectDcdxChainClusterPerformanceVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectDcdxChainClusterPerformanceMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectDcdxChainClusterPerformanceVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("达产达效-链群体系个性化数据统计表导出.xlsx")
    }
}
