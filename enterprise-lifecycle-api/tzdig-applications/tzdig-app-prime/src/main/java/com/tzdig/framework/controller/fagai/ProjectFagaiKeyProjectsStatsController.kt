package com.tzdig.framework.controller.fagai

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.core.constant.AreaConstant.DISTRICT_LIST
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectFagaiKeyProjectsStatsDTO
import com.tzdig.framework.model.dto.ProjectFagaiKeyProjectsStatsExcelRow
import com.tzdig.framework.model.vo.ProjectFagaiKeyProjectsStatsMergedVO
import com.tzdig.framework.mybatis.bo.ProjectFagaiKeyProjectsStatsVO
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiKeyProjectsStats
import com.tzdig.framework.mybatis.mapper.prime.ProjectFagaiKeyProjectsStatsMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.service.FagaiProjectService
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

@Tag(name = "开竣工—市级重点项目统计表管理")
@RestController
@RequestMapping("project-fagai-key-projects-stats")
class ProjectFagaiKeyProjectsStatsController(
    private val fagaiProjectService: FagaiProjectService,
) {
    @Operation(summary = "查询开竣工—市级重点项目统计表列表")
    //@SaCheckPermission("project-fagai-key-projects-stats::query")
    @GetMapping
    @PageableQuery
    fun listProjectFagaiKeyProjectsStats(
        pageable: Pageable,
        @Schema(description = "开工1、竣工2、在建3")
        @RequestParam(required = false) status: Int?,
        @Schema(description = "项目类型(市级重点1、全部2、1亿元3、10亿元4)")
        @RequestParam(required = false) type: Int?,
        @Schema(description = "是否市区")
        @RequestParam(required = false) isDistrict: Boolean?,
    ): PageableResult<ProjectFagaiKeyProjectsStatsVO> {
        val page = paginate<ProjectFagaiKeyProjectsStats>(pageable.pageNumber, pageable.pageSize) {
            if (status != null) {
                and(ProjectFagaiKeyProjectsStats::status eq status)
            }
            if (type != null) {
                and(ProjectFagaiKeyProjectsStats::type eq type)
            }
            if (isDistrict == true) {
                and(ProjectFagaiKeyProjectsStats::city inList DISTRICT_LIST.map { it.second })
                and(ProjectFagaiKeyProjectsStats::park eq "全部")
            }
        }.map(::ProjectFagaiKeyProjectsStatsVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询开竣工—市级重点项目统计表")
    //@SaCheckPermission("project-fagai-key-projects-stats::query")
    @GetMapping("{id}")
    fun getProjectFagaiKeyProjectsStats(
        @PathVariable id: String,
    ): ProjectFagaiKeyProjectsStatsVO {
        val record = queryOneById<ProjectFagaiKeyProjectsStats>(id)
            ?: throw NotFoundException("开竣工—市级重点项目统计表不存在")
        return ProjectFagaiKeyProjectsStatsVO(record)
    }

    @Operation(summary = "创建开竣工—市级重点项目统计表")
    //@SaCheckPermission("project-fagai-key-projects-stats::create")
    @PostMapping
    fun createProjectFagaiKeyProjectsStats(
        @RequestBody dto: ProjectFagaiKeyProjectsStatsDTO,
    ) {
        dto.toProjectFagaiKeyProjectsStats().save()
    }

    @Operation(summary = "修改开竣工—市级重点项目统计表")
    //@SaCheckPermission("project-fagai-key-projects-stats::update")
    @PutMapping("{id}")
    fun updateProjectFagaiKeyProjectsStats(
        @PathVariable id: String,
        @RequestBody dto: ProjectFagaiKeyProjectsStatsDTO,
    ) {
        val record = queryOneById<ProjectFagaiKeyProjectsStats>(id)
            ?: throw NotFoundException("开竣工—市级重点项目统计表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除开竣工—市级重点项目统计表")
    //@SaCheckPermission("project-fagai-key-projects-stats::delete")
    @DeleteMapping("{id}")
    fun deleteProjectFagaiKeyProjectsStats(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectFagaiKeyProjectsStats>(id)
        if (result == 0) throw NotFoundException("开竣工—市级重点项目统计表不存在")
    }

    @Operation(summary = "开竣工—市级重点项目统计表导入模板")
    //@SaCheckPermission("project-fagai-key-projects-stats::create")
    @GetMapping("template.xlsx")
    fun getProjectFagaiKeyProjectsStatsImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectFagaiKeyProjectsStatsExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("开竣工—市级重点项目统计表导入模板.xlsx")
    }

    @Operation(summary = "批量导入开竣工—市级重点项目统计表")
    //@SaCheckPermission("project-fagai-key-projects-stats::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importProjectFagaiKeyProjectsStats(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectFagaiKeyProjectsStatsExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectFagaiKeyProjectsStatsExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectFagaiKeyProjectsStatsExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectFagaiKeyProjectsStats().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectFagaiKeyProjectsStatsExcelRow::class)
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

    @Operation(summary = "批量导出开竣工—市级重点项目统计表")
    //@SaCheckPermission("project-fagai-key-projects-stats::query")
    @GetMapping("export.xlsx")
    fun exportProjectFagaiKeyProjectsStats(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectFagaiKeyProjectsStatsVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectFagaiKeyProjectsStatsMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectFagaiKeyProjectsStatsVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("开竣工—市级重点项目统计表导出.xlsx")
    }

    @Operation(summary = "查询开竣工—市级重点项目统计表列表(已归并)")
    //@SaCheckPermission("project-fagai-key-projects-stats::query")
    @GetMapping("merged")
    fun getMergedProjectFagaiKeyProjectsStats(
        @Schema(description = "开工1、竣工2、在建3")
        @RequestParam status: Int,
        @Schema(description = "项目类型(市级重点：1、一亿元：2、十亿元：3、全部：4)")
        @RequestParam(defaultValue = "1") type: Int,
        @Schema(description = "时间(yyyy-mm-dd)")
        @RequestParam date: String?,
        @Schema(description = "产业链名称")
        @RequestParam industry: String?
    ): ProjectFagaiKeyProjectsStatsMergedVO {
        val left = fagaiProjectService.getAllFagaiState(status, 1, date, industry)
            .associateBy { Triple(it.city, it.park, it.industrialChainCluster) }
        val right = fagaiProjectService.getAllFagaiState(status, type, date, industry)
            .associateBy { Triple(it.city, it.park, it.industrialChainCluster) }
        val keys = left.keys.union(right.keys)
        val list = keys.map {
            it to ProjectFagaiKeyProjectsStatsMergedVO(it, left[it], right[it])
        }
        val root = list.find { (k, _) ->
            k.first == "泰州市" && k.second == "全部" && k.third == "全部"
        }!!.second
        list.forEach { (key, item) ->
            val parent = if (key.first == "泰州市") {
                null
            } else if (key.second == "全部") {
                root
            } else if (key.third == "全部") {
                item.city = ""
                list.find { (k, _) ->
                    k.first == key.first && k.second == "全部" && k.third == "全部"
                }?.second
            } else {
                item.city = ""
                item.park = ""
                list.find { (k, _) ->
                    k.first == key.first && k.second == key.second && k.third == "全部"
                }?.second
            }
            parent?.children?.add(item)
        }
        return root
    }
}
