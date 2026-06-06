package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectItemStatParam
import com.tzdig.framework.model.dto.ProjectStatParam
import com.tzdig.framework.model.dto.StatProjectStageDTO
import com.tzdig.framework.model.dto.StatProjectStageExcelRow
import com.tzdig.framework.model.vo.ProjectStageCountVo
import com.tzdig.framework.model.vo.StatProjectStageVO
import com.tzdig.framework.mybatis.bo.StageOverViewDeptGroupBO
import com.tzdig.framework.mybatis.dao.ProjectConstructionApprovalDAO
import com.tzdig.framework.mybatis.dao.ProjectStatDataDAO
import com.tzdig.framework.mybatis.entity.prime.StatProjectStage
import com.tzdig.framework.mybatis.mapper.prime.StatProjectStageMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.service.StatProjectStageService
import com.tzdig.framework.util.QuarterDateUtil
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Tag(name = "工改项目阶段统计管理")
@RestController
@RequestMapping("stat-project-stage")
class StatProjectStageController(
    private val statProjectStageService: StatProjectStageService,
    private val projectStatDataDAO: ProjectStatDataDAO,
    private val projectConstructionApprovalDAO: ProjectConstructionApprovalDAO,
) {
    @Operation(summary = "查询工改项目阶段统计列表")
    //@SaCheckPermission("stat-project-stage::query")
    @GetMapping
    @PageableQuery
    fun listStatProjectStage(
        pageable: Pageable,
    ): PageableResult<StatProjectStageVO> {
        val page = paginate<StatProjectStage>(pageable.pageNumber, pageable.pageSize) {
            //TODO
        }.map(::StatProjectStageVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询工改项目阶段统计")
    //@SaCheckPermission("stat-project-stage::query")
    @GetMapping("{id}")
    fun getStatProjectStage(
        @PathVariable id: String,
    ): StatProjectStageVO {
        val record = queryOneById<StatProjectStage>(id)
            ?: throw NotFoundException("工改项目阶段统计不存在")
        return StatProjectStageVO(record)
    }

    @Operation(summary = "创建工改项目阶段统计")
    //@SaCheckPermission("stat-project-stage::create")
    @PostMapping
    fun createStatProjectStage(
        @RequestBody dto: StatProjectStageDTO,
    ) {
        dto.toStatProjectStage().save()
    }

    @Operation(summary = "修改工改项目阶段统计")
    //@SaCheckPermission("stat-project-stage::update")
    @PutMapping("{id}")
    fun updateStatProjectStage(
        @PathVariable id: String,
        @RequestBody dto: StatProjectStageDTO,
    ) {
        val record = queryOneById<StatProjectStage>(id)
            ?: throw NotFoundException("工改项目阶段统计不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除工改项目阶段统计")
    //@SaCheckPermission("stat-project-stage::delete")
    @DeleteMapping("{id}")
    fun deleteStatProjectStage(
        @PathVariable id: String,
    ) {
        val result = deleteById<StatProjectStage>(id)
        if (result == 0) throw NotFoundException("工改项目阶段统计不存在")
    }

    @Operation(summary = "工改项目阶段统计导入模板")
    //@SaCheckPermission("stat-project-stage::create")
    @GetMapping("template.xlsx")
    fun getStatProjectStageImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(StatProjectStageExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("工改项目阶段统计导入模板.xlsx")
    }

    @Operation(summary = "批量导入工改项目阶段统计")
    //@SaCheckPermission("stat-project-stage::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importStatProjectStage(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<StatProjectStageExcelRow> =
                ExcelReadUtils.readFlux(tempFile, StatProjectStageExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<StatProjectStageExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toStatProjectStage().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(StatProjectStageExcelRow::class)
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

    @Operation(summary = "批量导出工改项目阶段统计")
    //@SaCheckPermission("stat-project-stage::query")
    @GetMapping("export.xlsx")
    fun exportStatProjectStage(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(StatProjectStageVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<StatProjectStageMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(StatProjectStageVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("工改项目阶段统计导出.xlsx")
    }

    @Operation(summary = "项目备案统计（按区划）")
    @GetMapping("stage-division")
    fun stageDivisionOverview(projectStatParam: ProjectStatParam): ProjectStageCountVo? {
        val totalList = if (projectStatParam.month.isNotEmpty()) {
            val queryDate = if (projectStatParam.month.isBlank()) LocalDate.now()
            else LocalDate.parse("${projectStatParam.month}-01", DateTimeFormatter.ISO_LOCAL_DATE)
            val monthStart = queryDate.atStartOfDay()
            val monthEnd = queryDate.plusMonths(1).atStartOfDay().minusNanos(1)
            projectStatDataDAO.stageOverViewByTimeRangeGroup(monthStart, monthEnd)
        } else {
            projectStatDataDAO.stageOverViewByTimeRangeGroup(null, null)
        }
        val stageList = listOf("1", "2", "3", "4")
        val parents = AreaConstant.DISTRICT_LIST.map { (district, _) ->
            val children = totalList.filter { it.administrativeDivision == district }
                .groupBy { it.park }
                .map { (park, items) ->
                    val divisionStageMap = items.groupBy { it.stage }
                    statProjectStageService.getTempStageData(
                        district = "",
                        park = park,
                        divisionStageMap = divisionStageMap,
                        stageList = stageList,
                    )
                }
            createParent(district, children)
        }
        return createParent(AreaConstant.TAIZHOU_CODE, parents)
    }

    private fun createParent(district: String, children: List<ProjectStageCountVo>): ProjectStageCountVo {
        val parent = ProjectStageCountVo()
        parent.children = children
        parent.district = district
        parent.park = ""
        parent.stageApprovalCount = parent.children.sumOf { it.stageApprovalCount }
        parent.stageECCount = parent.children.sumOf { it.stageECCount }
        parent.stagePermitStageCount = parent.children.sumOf { it.stagePermitStageCount }
        parent.stageCompleted = parent.children.sumOf { it.stageCompleted }
        return parent
    }

    @Operation(summary = "项目备案统计（按部门）")
    @GetMapping("stage-dept")
    fun stageDeptOverview(projectItemStatParam: ProjectItemStatParam): List<StageOverViewDeptGroupBO> {
        val year = projectItemStatParam.year ?: LocalDate.now().year
        val quarter = projectItemStatParam.quarter
            .takeIf { it in 1..4 }
            ?: throw NotFoundException("选择的季度不能为空")
        val startTime = QuarterDateUtil.getQuarterStart(year, quarter)
        val endTime = QuarterDateUtil.getQuarterEnd(year, quarter)
        return projectConstructionApprovalDAO.stageOverViewDeptGroup(startTime, endTime)
    }
}
