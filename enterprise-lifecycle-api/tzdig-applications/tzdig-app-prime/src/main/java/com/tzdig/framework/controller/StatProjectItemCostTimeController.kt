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
import com.tzdig.framework.model.dto.StatProjectItemCostTimeDTO
import com.tzdig.framework.model.dto.StatProjectItemCostTimeExcelRow
import com.tzdig.framework.model.vo.ProjectDivisionItemCostVO
import com.tzdig.framework.model.vo.StatProjectItemCostTimeVO
import com.tzdig.framework.mybatis.dao.ProjectStatDataDAO
import com.tzdig.framework.mybatis.entity.prime.StatProjectItemCostTime
import com.tzdig.framework.mybatis.mapper.prime.StatProjectItemCostTimeMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
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

@Tag(name = "工改项目事项时间管理")
@RestController
@RequestMapping("stat-project-item-cost-time")
class StatProjectItemCostTimeController(
    private val projectStatDataDAO: ProjectStatDataDAO,
) {
    @Operation(summary = "查询工改项目事项时间列表")
    //@SaCheckPermission("stat-project-item-cost-time::query")
    @GetMapping
    @PageableQuery
    fun listStatProjectItemCostTime(
        pageable: Pageable,
    ): PageableResult<StatProjectItemCostTimeVO> {
        val page = paginate<StatProjectItemCostTime>(pageable.pageNumber, pageable.pageSize) {
            //TODO
        }.map(::StatProjectItemCostTimeVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询工改项目事项时间")
    //@SaCheckPermission("stat-project-item-cost-time::query")
    @GetMapping("{id}")
    fun getStatProjectItemCostTime(
        @PathVariable id: String,
    ): StatProjectItemCostTimeVO {
        val record = queryOneById<StatProjectItemCostTime>(id)
            ?: throw NotFoundException("工改项目事项时间不存在")
        return StatProjectItemCostTimeVO(record)
    }

    @Operation(summary = "创建工改项目事项时间")
    //@SaCheckPermission("stat-project-item-cost-time::create")
    @PostMapping
    fun createStatProjectItemCostTime(
        @RequestBody dto: StatProjectItemCostTimeDTO,
    ) {
        dto.toStatProjectItemCostTime().save()
    }

    @Operation(summary = "修改工改项目事项时间")
    //@SaCheckPermission("stat-project-item-cost-time::update")
    @PutMapping("{id}")
    fun updateStatProjectItemCostTime(
        @PathVariable id: String,
        @RequestBody dto: StatProjectItemCostTimeDTO,
    ) {
        val record = queryOneById<StatProjectItemCostTime>(id)
            ?: throw NotFoundException("工改项目事项时间不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除工改项目事项时间")
    //@SaCheckPermission("stat-project-item-cost-time::delete")
    @DeleteMapping("{id}")
    fun deleteStatProjectItemCostTime(
        @PathVariable id: String,
    ) {
        val result = deleteById<StatProjectItemCostTime>(id)
        if (result == 0) throw NotFoundException("工改项目事项时间不存在")
    }

    @Operation(summary = "工改项目事项时间导入模板")
    //@SaCheckPermission("stat-project-item-cost-time::create")
    @GetMapping("template.xlsx")
    fun getStatProjectItemCostTimeImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(StatProjectItemCostTimeExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("工改项目事项时间导入模板.xlsx")
    }

    @Operation(summary = "批量导入工改项目事项时间")
    //@SaCheckPermission("stat-project-item-cost-time::create")
    @PostMapping("import.xlsx", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importStatProjectItemCostTime(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<StatProjectItemCostTimeExcelRow> =
                ExcelReadUtils.readFlux(tempFile, StatProjectItemCostTimeExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<StatProjectItemCostTimeExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toStatProjectItemCostTime().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(StatProjectItemCostTimeExcelRow::class)
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

    @Operation(summary = "批量导出工改项目事项时间")
    //@SaCheckPermission("stat-project-item-cost-time::query")
    @GetMapping("export.xlsx")
    fun exportStatProjectItemCostTime(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(StatProjectItemCostTimeVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<StatProjectItemCostTimeMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(StatProjectItemCostTimeVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("工改项目事项时间导出.xlsx")
    }

    @Operation(summary = "项目审批统计")
    @GetMapping("division-stat")
    fun itemDivisionStat(projectItemStatParam: ProjectItemStatParam): ProjectDivisionItemCostVO {
        val year = projectItemStatParam.year ?: LocalDate.now().year
        val quarter = projectItemStatParam.quarter
            .takeIf { it in 1..4 }
            ?: throw NotFoundException("选择的季度不能为空")
        val startTime = QuarterDateUtil.getQuarterStart(year, quarter)
        val endTime = QuarterDateUtil.getQuarterEnd(year, quarter)
        val itemNames = listOf("施工图审查", "环评", "能评", "施工许可")
        val projectItemNameCostTimeBos = projectStatDataDAO.queryParkItemNameCostTimeByDateRange(
            startTime, endTime,
            projectItemStatParam.district,
        )
        val parents = AreaConstant.DISTRICT_LIST.map { (district, _) ->
            val list = projectItemNameCostTimeBos
                .filter { it.administrativeDivision == district }
                .groupBy { it.park }
                .map { (park, projectList) ->
                    val projectDivisionItemCostVo = ProjectDivisionItemCostVO(
                        district = "", park = park, children = emptyList()
                    )
                    if (projectList.isNotEmpty()) {
                        val itemMap = projectList.groupBy { it.itemName }
                        for (itemName in itemNames) {
                            val list = itemMap[itemName] ?: emptyList()
                            var statusFinishCount = 0L
                            var statusApplyCount = 0L
                            var costTime = 0L
                            for (projectItemNameCostTimeBo in list) {
                                if ("1" == projectItemNameCostTimeBo.docStatus) {
                                    statusFinishCount += projectItemNameCostTimeBo.itemCount
                                } else {
                                    statusApplyCount += projectItemNameCostTimeBo.itemCount
                                }
                                costTime += projectItemNameCostTimeBo.spendTime
                            }
                            when (itemName) {
                                "施工图审查" -> {
                                    projectDivisionItemCostVo.drawingReviewFinishCount = statusFinishCount
                                    projectDivisionItemCostVo.drawingReviewSubmitCount = statusApplyCount
                                    projectDivisionItemCostVo.drawingReviewCostTime = costTime
                                }

                                "环评" -> {
                                    projectDivisionItemCostVo.envAssessmentFinishCount = statusFinishCount
                                    projectDivisionItemCostVo.envAssessmentSubmitCount = statusApplyCount
                                    projectDivisionItemCostVo.envAssessmentCostTime = costTime
                                }

                                "能评" -> {
                                    projectDivisionItemCostVo.energyAssessmentFinishCount = statusFinishCount
                                    projectDivisionItemCostVo.energyAssessmentSubmitCount = statusApplyCount
                                    projectDivisionItemCostVo.energyAssessmentCostTime = costTime
                                }

                                "施工许可" -> {
                                    projectDivisionItemCostVo.constructionPermitsCount =
                                        statusFinishCount + statusApplyCount
                                }
                            }
                        }
                    }
                    projectDivisionItemCostVo
                }
            createParent(district, list)
        }
        return createParent(AreaConstant.TAIZHOU_CODE, parents)
    }

    private fun createParent(district: String, children: List<ProjectDivisionItemCostVO>): ProjectDivisionItemCostVO {
        val parent = ProjectDivisionItemCostVO(
            district = district, park = "", children = children,
        )
        parent.drawingReviewFinishCount = parent.children.sumOf { it.drawingReviewFinishCount }
        parent.drawingReviewSubmitCount = parent.children.sumOf { it.drawingReviewSubmitCount }
        parent.drawingReviewCostTime = parent.children.sumOf { it.drawingReviewCostTime }
        parent.envAssessmentFinishCount = parent.children.sumOf { it.envAssessmentFinishCount }
        parent.envAssessmentSubmitCount = parent.children.sumOf { it.envAssessmentSubmitCount }
        parent.envAssessmentCostTime = parent.children.sumOf { it.envAssessmentCostTime }
        parent.energyAssessmentFinishCount = parent.children.sumOf { it.energyAssessmentFinishCount }
        parent.energyAssessmentSubmitCount = parent.children.sumOf { it.energyAssessmentSubmitCount }
        parent.energyAssessmentCostTime = parent.children.sumOf { it.energyAssessmentCostTime }
        parent.constructionPermitsCount = parent.children.sumOf { it.constructionPermitsCount }
        return parent
    }
}
