package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.`as`
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.sql.div
import com.mybatisflex.kotlin.extensions.sql.times
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.core.constant.AreaConstant.DISTRICT_LIST
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectImportantProvinceInfoDTO
import com.tzdig.framework.model.dto.ProjectImportantProvinceInfoExcelRow
import com.tzdig.framework.model.vo.ProjectAreaVO
import com.tzdig.framework.model.vo.ProjectImportantProvinceInfoVO
import com.tzdig.framework.model.vo.ProjectInvestmentVO
import com.tzdig.framework.mybatis.entity.prime.ProjectImportantProvinceInfo
import com.tzdig.framework.mybatis.mapper.prime.ProjectImportantProvinceInfoMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.service.InvestOnlineService
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "省市重大项目总表管理")
@RestController
@RequestMapping("project-important-province-info")
class ProjectImportantProvinceInfoController(
    private val investOnlineService: InvestOnlineService
) {

    @Operation(summary = "查询省市重大项目数据")
    @GetMapping("statics")
    fun statics(
        @Schema(description = "年份")
        @RequestParam(required = false) year: Int?,
        @Schema(description = "等级（省，市）")
        @RequestParam(defaultValue = "省") level: String,
    ): List<ProjectInvestmentVO?> {
        //todo 园区权限

        val count = queryCount<ProjectImportantProvinceInfo> {
            select(QueryMethods.count(ProjectImportantProvinceInfo::id))
            where(ProjectImportantProvinceInfo::year eq year)
            and(ProjectImportantProvinceInfo::level eq level)
        }
        val results = query<ProjectInvestmentVO> {
            from(ProjectImportantProvinceInfo::class.java)
            select(QueryMethods.count(ProjectImportantProvinceInfo::id).`as`(ProjectInvestmentVO::areaTotal.name))
            select(ProjectImportantProvinceInfo::sector.`as`(ProjectInvestmentVO::area.name))
            select(
                QueryMethods.round(QueryMethods.count(ProjectImportantProvinceInfo::id).divide(count).times(100), 2)
                    .`as`(
                        ProjectInvestmentVO::ratio.name
                    )
            )
            where(ProjectImportantProvinceInfo::year eq year)
            and(ProjectImportantProvinceInfo::level eq level)
            groupBy(ProjectImportantProvinceInfo::sector)
        }
        results.forEach { result ->
            result.year = year!!
            result.projectTotal = count.toInt()
        }
        val customOrder = DISTRICT_LIST.map { it.second }
        return results.sortedBy { customOrder.indexOf(it.area) }
    }

    @Operation(summary = "查询投资情况")
    @GetMapping("invest-statics")
    fun investStatics(
        @Schema(description = "年份")
        @RequestParam(required = false) year: Int?,
        @Schema(description = "等级（省，市）")
        @RequestParam(defaultValue = "省") level: String,
        @Schema(description = "区域")
        @RequestParam(defaultValue = "泰州市") area: String?,
    ): List<ProjectAreaVO?> {
        //todo 园区权限

        val results = query<ProjectAreaVO> {
            from(ProjectImportantProvinceInfo::class.java)
            select(ProjectImportantProvinceInfo::sector.`as`(ProjectAreaVO::region.name))
            select(
                QueryMethods.sum(ProjectImportantProvinceInfo::investmentCompletedCurrentYear).div(10000)
                    .`as`(ProjectAreaVO::actualDomesticInvest.name),
                QueryMethods.sum(ProjectImportantProvinceInfo::plannedInvestmentCurrentYear).div(10000)
                    .`as`(ProjectAreaVO::planDomesticInvest.name),
            )
            where(ProjectImportantProvinceInfo::year eq year)
            if (area != "泰州市") {
                and(ProjectImportantProvinceInfo::sector eq area)
            }
            and(ProjectImportantProvinceInfo::level eq level)
            groupBy(ProjectImportantProvinceInfo::sector)
        }
        results.forEach { result ->
            result.investRatio = if (result.planDomesticInvest == 0.0 || result.actualDomesticInvest == 0.0)
                0.0
            else
                100.0 * result.actualDomesticInvest.div(result.planDomesticInvest)
        }
        return results
    }

    @Operation(summary = "查询省市重大项目总表列表")
    //@SaCheckPermission("project-important-province-info::query")
    @GetMapping
    @PageableQuery
    fun listProjectImportantProvinceInfo(
        pageable: Pageable,
        @Schema(description = "年份")
        @RequestParam(defaultValue = "2024") year: Int,
        @Schema(description = "等级（省，市）")
        @RequestParam(defaultValue = "省") level: String,
    ): PageableResult<ProjectImportantProvinceInfoVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        val name = investOnlineService.getAllAreaName()
        val page = paginate<ProjectImportantProvinceInfo>(pageable.pageNumber, pageable.pageSize) {
            where(ProjectImportantProvinceInfo::year eq year)
            and(ProjectImportantProvinceInfo::level eq level)
            if (AreaConstant.TAIZHOU_CODE in grantedAreas)
                and(ProjectImportantProvinceInfo::sector inList DISTRICT_LIST.map { it.second })
            else
                and(ProjectImportantProvinceInfo::park inList name)
        }.map(::ProjectImportantProvinceInfoVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询省市重大项目总表")
    //@SaCheckPermission("project-important-province-info::query")
    @GetMapping("{id}")
    fun getProjectImportantProvinceInfo(
        @PathVariable id: String,
    ): ProjectImportantProvinceInfoVO {
        val record = queryOneById<ProjectImportantProvinceInfo>(id)
            ?: throw NotFoundException("省市重大项目总表不存在")
        return ProjectImportantProvinceInfoVO(record)
    }

    @Operation(summary = "创建省市重大项目总表")
    //@SaCheckPermission("project-important-province-info::create")
    @PostMapping
    fun createProjectImportantProvinceInfo(
        @RequestBody dto: ProjectImportantProvinceInfoDTO,
    ) {
        dto.toProjectImportantProvinceInfo().save()
    }

    @Operation(summary = "修改省市重大项目总表")
    //@SaCheckPermission("project-important-province-info::update")
    @PutMapping("{id}")
    fun updateProjectImportantProvinceInfo(
        @PathVariable id: String,
        @RequestBody dto: ProjectImportantProvinceInfoDTO,
    ) {
        val record = queryOneById<ProjectImportantProvinceInfo>(id)
            ?: throw NotFoundException("省市重大项目总表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除省市重大项目总表")
    //@SaCheckPermission("project-important-province-info::delete")
    @DeleteMapping("{id}")
    fun deleteProjectImportantProvinceInfo(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectImportantProvinceInfo>(id)
        if (result == 0) throw NotFoundException("省市重大项目总表不存在")
    }

    @Operation(summary = "省市重大项目总表导入模板")
    //@SaCheckPermission("project-important-province-info::create")
    @GetMapping("template.xlsx")
    fun getProjectImportantProvinceInfoImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectImportantProvinceInfoExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("省市重大项目总表导入模板.xlsx")
    }

    @Operation(summary = "批量导入省市重大项目总表")
    //@SaCheckPermission("project-important-province-info::create")
    @PostMapping("import.xlsx")
    fun importProjectImportantProvinceInfo(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectImportantProvinceInfoExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectImportantProvinceInfoExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectImportantProvinceInfoExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectImportantProvinceInfo().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectImportantProvinceInfoExcelRow::class)
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

    @Operation(summary = "批量导出省市重大项目总表")
    //@SaCheckPermission("project-important-province-info::query")
    @GetMapping("export.xlsx")
    fun exportProjectImportantProvinceInfo(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectImportantProvinceInfoVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectImportantProvinceInfoMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectImportantProvinceInfoVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("省市重大项目总表导出.xlsx")
    }


}
