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
import com.tzdig.framework.model.dto.ProjectCompletedInfoDTO
import com.tzdig.framework.model.dto.ProjectCompletedInfoExcelRow
import com.tzdig.framework.model.vo.ProjectCompletedInfoVO
import com.tzdig.framework.model.vo.ProjectInvestVO
import com.tzdig.framework.model.vo.ProjectInvestmentVO
import com.tzdig.framework.mybatis.entity.prime.ProjectCompletedInfo
import com.tzdig.framework.mybatis.mapper.prime.ProjectCompletedInfoMapper
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

@Tag(name = "竣工项目总表管理")
@RestController
@RequestMapping("project-completed-info")
class ProjectCompletedInfoController(
    private val investOnlineService: InvestOnlineService
) {

    @Operation(summary = "查询竣工项目数据")
    @GetMapping("statics")
    fun statics(
        @Schema(description = "年份")
        @RequestParam(required = false) year: Int?,
        @Schema(description = "区域")
        @RequestParam(defaultValue = "泰州市") area: String?,
    ): List<ProjectInvestmentVO?> {
        //todo 园区权限
        val count = queryCount<ProjectCompletedInfo> {
            select(QueryMethods.count(ProjectCompletedInfo::id))
            where(ProjectCompletedInfo::year eq year)
        }
        val results = query<ProjectInvestmentVO> {
            from(ProjectCompletedInfo::class.java)
            select(QueryMethods.count(ProjectCompletedInfo::id).`as`(ProjectInvestmentVO::areaTotal.name))
            select(ProjectCompletedInfo::sector.`as`(ProjectInvestmentVO::area.name))
            select(
                QueryMethods.round(QueryMethods.count(ProjectCompletedInfo::id).divide(count).times(100), 2).`as`(
                    ProjectInvestmentVO::ratio.name
                )
            )
            if (area != "泰州市") {
                and(ProjectCompletedInfo::sector eq area)
            }
            where(ProjectCompletedInfo::year eq year)
            groupBy(ProjectCompletedInfo::sector)
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
        @Schema(description = "区域")
        @RequestParam(defaultValue = "泰州市") area: String?,
    ): ProjectInvestVO? {
        //todo 园区权限
        val result = queryOne<ProjectInvestVO> {
            from(ProjectCompletedInfo::class.java)
            select(
                QueryMethods.sum(ProjectCompletedInfo::plannedTotalInvestmentDomestic).div(10000)
                    .`as`(ProjectInvestVO::planDomesticInvest.name),
                QueryMethods.sum(ProjectCompletedInfo::actualCompletionInvestmentDomestic).div(10000)
                    .`as`(ProjectInvestVO::actualDomesticInvest.name),
                QueryMethods.sum(ProjectCompletedInfo::plannedTotalInvestmentForeign).div(10000)
                    .`as`(ProjectInvestVO::planForeignInvest.name),
                QueryMethods.sum(ProjectCompletedInfo::actualCompletionInvestmentForeign).div(10000)
                    .`as`(ProjectInvestVO::actualForeignInvest.name)
            )
            where(ProjectCompletedInfo::year eq year)
            if (area == "泰州市") {
                and(ProjectCompletedInfo::sector inList DISTRICT_LIST.map { it.second })
            } else {
                and(ProjectCompletedInfo::sector eq area)
            }
        }
        if (result != null) {
            result.domesticInvestRatio = if (result.planDomesticInvest == 0.0 || result.actualDomesticInvest == 0.0)
                0.0
            else
                100.0 * result.actualDomesticInvest.div(result.planDomesticInvest)

            result.foreignInvestRatio = if (result.planForeignInvest == 0.0 || result.actualForeignInvest == 0.0)
                0.0
            else
                100.0 * result.actualForeignInvest.div(result.planForeignInvest)

        }
        return result
    }


    @Operation(summary = "查询竣工项目总表列表")
    //@SaCheckPermission("project-completed-info::query")
    @GetMapping
    @PageableQuery
    fun listProjectCompletedInfo(
        pageable: Pageable,
        @Schema(description = "年份")
        @RequestParam(defaultValue = "2024") year: String,
    ): PageableResult<ProjectCompletedInfoVO> {
        val page = paginate<ProjectCompletedInfo>(pageable.pageNumber, pageable.pageSize) {
            val grantedAreas = DataGrantsUtils.grantedAreas
            val areaNameList = investOnlineService.getAllAreaName()
            where(ProjectCompletedInfo::year eq year)
            if (AreaConstant.TAIZHOU_CODE in grantedAreas)
                and(ProjectCompletedInfo::sector inList DISTRICT_LIST.map { it.second })
            else
                and(ProjectCompletedInfo::park inList areaNameList)

        }.map(::ProjectCompletedInfoVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询竣工项目总表")
    //@SaCheckPermission("project-completed-info::query")
    @GetMapping("{id}")
    fun getProjectCompletedInfo(
        @PathVariable id: String,
    ): ProjectCompletedInfoVO {
        val record = queryOneById<ProjectCompletedInfo>(id)
            ?: throw NotFoundException("竣工项目总表不存在")
        return ProjectCompletedInfoVO(record)
    }

    @Operation(summary = "创建竣工项目总表")
    //@SaCheckPermission("project-completed-info::create")
    @PostMapping
    fun createProjectCompletedInfo(
        @RequestBody dto: ProjectCompletedInfoDTO,
    ) {
        dto.toProjectCompletedInfo().save()
    }

    @Operation(summary = "修改竣工项目总表")
    //@SaCheckPermission("project-completed-info::update")
    @PutMapping("{id}")
    fun updateProjectCompletedInfo(
        @PathVariable id: String,
        @RequestBody dto: ProjectCompletedInfoDTO,
    ) {
        val record = queryOneById<ProjectCompletedInfo>(id)
            ?: throw NotFoundException("竣工项目总表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除竣工项目总表")
    //@SaCheckPermission("project-completed-info::delete")
    @DeleteMapping("{id}")
    fun deleteProjectCompletedInfo(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectCompletedInfo>(id)
        if (result == 0) throw NotFoundException("竣工项目总表不存在")
    }

    @Operation(summary = "竣工项目总表导入模板")
    //@SaCheckPermission("project-completed-info::create")
    @GetMapping("template.xlsx")
    fun getProjectCompletedInfoImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectCompletedInfoExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("竣工项目总表导入模板.xlsx")
    }

    @Operation(summary = "批量导入竣工项目总表")
    //@SaCheckPermission("project-completed-info::create")
    @PostMapping("import.xlsx")
    fun importProjectCompletedInfo(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectCompletedInfoExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectCompletedInfoExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectCompletedInfoExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectCompletedInfo().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectCompletedInfoExcelRow::class)
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

    @Operation(summary = "批量导出竣工项目总表")
    //@SaCheckPermission("project-completed-info::query")
    @GetMapping("export.xlsx")
    fun exportProjectCompletedInfo(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectCompletedInfoVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectCompletedInfoMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectCompletedInfoVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("竣工项目总表导出.xlsx")
    }

//    @Operation(summary = "工业竣工项目投入情况")
//    @GetMapping("invest-statics")
//    fun investStatics(): {
//
//    }
}
