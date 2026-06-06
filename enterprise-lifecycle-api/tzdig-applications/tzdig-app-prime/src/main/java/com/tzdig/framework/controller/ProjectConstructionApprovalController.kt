package com.tzdig.framework.controller

import com.mybatisflex.core.datasource.DataSourceKey
import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectConstructionApprovalDTO
import com.tzdig.framework.model.dto.ProjectConstructionApprovalExcelRow
import com.tzdig.framework.model.vo.ProjectConstructionApprovalItemVO
import com.tzdig.framework.model.vo.ProjectConstructionApprovalVO
import com.tzdig.framework.mybatis.dao.ProjectConstructionApprovalDAO
import com.tzdig.framework.mybatis.entity.prime.*
import com.tzdig.framework.mybatis.mapper.prime.ProjectConstructionApprovalMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.service.ProjectConstructionApprovalService
import com.tzdig.framework.util.QuarterDateUtil
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "工程建设审批管理")
@RestController
@RequestMapping("project-construction-approval")
class ProjectConstructionApprovalController(
    private val projectConstructionApprovalService: ProjectConstructionApprovalService,
    private val projectConstructionApprovalDAO: ProjectConstructionApprovalDAO
) {
    @Operation(summary = "查询工程建设审批列表")
    //@SaCheckPermission("project-construction-approval::query")
    @GetMapping
    @PageableQuery
    fun listProjectConstructionApproval(
        pageable: Pageable,
        @Schema(description = "项目代码")
        @RequestParam(defaultValue = "") projectCode: String,
        @Schema(description = "项目名称")
        @RequestParam(defaultValue = "") projectName: String,
        @Schema(description = "项目所属阶段")
        @RequestParam(defaultValue = "4") stage: String,
        @Schema(description = "企业名称")
        @RequestParam(defaultValue = "") companyName: String,
        @Schema(description = "市（区）")
        @RequestParam(defaultValue = "") district: String,
        @Schema(description = "园区")
        @RequestParam(defaultValue = "") park: String,
        @Schema(description = "年份")
        @RequestParam(required = false) year: Int?,
        @Schema(description = "季度")
        @RequestParam(required = false) quarter: Int?,
        @Schema(description = "事项名称")
        @RequestParam(defaultValue = "") itemName: String,
    ): PageableResult<ProjectConstructionApprovalVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val ids = query<ProjectInvestmentXConstructionApproval> {
            join(ProjectDigitalInvestmentAttracting::class.java)
                .on(ProjectDigitalInvestmentAttracting::id eq ProjectInvestmentXConstructionApproval::investmentId)
            if (district.isNotEmpty() && district != AreaConstant.TAIZHOU_CODE) {
                and(ProjectDigitalInvestmentAttracting::district eq district)
            }
            if (park.isNotEmpty()) {
                and(ProjectDigitalInvestmentAttracting::park eq park)
            }
            and {
                it.or(ProjectDigitalInvestmentAttracting::district inList grantedAreas)
                it.or(ProjectDigitalInvestmentAttracting::park inList grantedAreas)
            }
        }.map { it.constructionApprovalId!! }
        if (ids.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val itemNameList = when (itemName) {
            "施工图审查" -> listOf(
                "施工图设计文件审查",
            )

            "环评" -> listOf(
                "辐射建设项目环境影响评价文件审批",
                "建设项目环境影响评价文件审批（不含入海排污口设置审批，不含辐射建设项目）",
            )

            "能评" -> listOf(
                "固定资产投资项目节能审查（发改委）",
                "固定资产投资项目节能审查（工信部）"
            )

            "施工许可" -> listOf(
                "建筑工程施工许可证的发放",
                "建筑工程施工许可证的发放(含质量、安全监督手续）",
            )

            else -> null
        }
        val projectCodes = if (itemNameList == null || year == null || quarter == null) null else {
            val startTime = QuarterDateUtil.getQuarterStart(year, quarter)
            val endTime = QuarterDateUtil.getQuarterEnd(year, quarter)
            val projectCodes = projectConstructionApprovalDAO.getProjectCodeByItemNameAndCreateTime(
                itemNameList, startTime, endTime
            )
            if (projectCodes.isEmpty()) {
                return PageableResult.empty(pageable)
            }
            projectCodes
        }
        val page = paginate<ProjectConstructionApproval>(pageable.pageNumber, pageable.pageSize) {
            where(ProjectConstructionApproval::id inList ids)
            if (projectCode.isNotEmpty()) and(ProjectConstructionApproval::projectCode eq projectCode)
            if (projectName.isNotEmpty()) and(ProjectConstructionApproval::projectName like projectName)
            if (companyName.isNotEmpty()) and(ProjectConstructionApproval::companyName like companyName)
            if (stage != "4") and(ProjectConstructionApproval::stage eq stage)
            if (projectCodes != null) {
                and(ProjectConstructionApproval::projectCode inList projectCodes)
            }
            orderBy(ProjectConstructionApproval::projectType).desc()
        }.map(::ProjectConstructionApprovalVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询工程建设审批事项")
    @GetMapping("item")
    fun getItem(
        @Schema(description = "项目代码")
        @RequestParam code: String
    ): List<ProjectConstructionApprovalItemVO> {
        val documentNumbers = query<ProjectConstructionApprovalProcess> {
            select(ProjectConstructionApprovalProcess::documentNumber)
            where(ProjectConstructionApprovalProcess::projectCode eq code)
            where(ProjectConstructionApprovalProcess::documentNumber.isNotNull)
        }.map { it.documentNumber!! }
        val result = DataSourceKey.use<List<ProjectConstructionApprovalItemVO>>("gong-gai") {
            query<ProjectConstructionApprovalItemVO> {
                select(
                    ProjectConstructionRelation::stage
                        .`as`(ProjectConstructionApprovalItemVO::stage.name),
                    ProjectConstructionRelation::isBasicProcess
                        .`as`(ProjectConstructionApprovalItemVO::isBasic.name),
                    ProjectConstructionItemInfo::itemName
                        .`as`(ProjectConstructionApprovalItemVO::name.name),
                    ProjectConstructionItemInfo::commitmentTime
                        .`as`(ProjectConstructionApprovalItemVO::limitTime.name),
                    ProjectConstructionApprovalProcess::itemCode
                        .`as`(ProjectConstructionApprovalItemVO::itemCode.name),
                    ProjectConstructionItemInfo::approvalDepartment
                        .`as`(ProjectConstructionApprovalItemVO::department.name),
                    ProjectConstructionApprovalProcess::status
                        .`as`(ProjectConstructionApprovalItemVO::result.name),
                    ProjectConstructionApprovalProcess::finishTime
                        .`as`(ProjectConstructionApprovalItemVO::time.name)
                )
                leftJoin(ProjectConstructionItemInfo::class.java)
                    .on(ProjectConstructionApprovalProcess::documentNumber eq ProjectConstructionItemInfo::documentNumber)
                leftJoin(ProjectConstructionRelation::class.java)
                    .on(ProjectConstructionItemInfo::itemName eq ProjectConstructionRelation::itemName)
                where(ProjectConstructionApprovalProcess::documentNumber inList documentNumbers)
                orderBy(ProjectConstructionRelation::isBasicProcess)
                orderBy(ProjectConstructionRelation::order)
            }
        }
        val statusEnum = arrayOf("接件", "受理", "审批", "办结")
        return result.onEach {
            it.stage = when (it.stage) {
                "竣工验收阶段" -> 4
                "施工许可阶段" -> 3
                "工程建设许可阶段" -> 2
                "立项用地规划许可阶段" -> 1
                else -> 0
            }.toString()
        }.groupBy {
            Pair(it.name, it.stage)
        }.values.map { list ->
            list.maxBy { statusEnum.indexOf(it.result) }
        }
    }

    @Operation(summary = "查询工程建设审批阶段")
//@SaCheckPermission("project-construction-approval::query")
    @GetMapping("stage")
    fun getStage(
        @Schema(description = "项目代码")
        @RequestParam code: String
    ): SimpleValueDTO<Int> {
        val value = projectConstructionApprovalService.getProjectConstructionApprovalStage(code)
        return SimpleValueDTO(value)
    }

    @Operation(summary = "查询工程建设审批")
//@SaCheckPermission("project-construction-approval::query")
    @GetMapping("{id}")
    fun getProjectConstructionApproval(
        @PathVariable id: String,
    ): ProjectConstructionApprovalVO {
        val record = queryOneById<ProjectConstructionApproval>(id)
            ?: throw NotFoundException("工程建设审批不存在")
        return ProjectConstructionApprovalVO(record)
    }

    @Operation(summary = "通过code查询工程建设审批")
//@SaCheckPermission("project-construction-approval::query")
    @GetMapping("code")
    fun getProjectConstructionApprovalByCode(
        @Schema(description = "项目代码")
        @RequestParam code: String
    ): ProjectConstructionApprovalVO {
        val record = queryOne<ProjectConstructionApproval> {
            where(ProjectConstructionApproval::projectCode eq code)
        }
            ?: throw NotFoundException("工程建设审批不存在")
        return ProjectConstructionApprovalVO(record)
    }

    @Operation(summary = "创建工程建设审批")
//@SaCheckPermission("project-construction-approval::create")
    @PostMapping
    fun createProjectConstructionApproval(
        @RequestBody dto: ProjectConstructionApprovalDTO,
    ) {
        dto.toProjectConstructionApproval().save()
    }

    @Operation(summary = "修改工程建设审批")
//@SaCheckPermission("project-construction-approval::update")
    @PutMapping("{id}")
    fun updateProjectConstructionApproval(
        @PathVariable id: String,
        @RequestBody dto: ProjectConstructionApprovalDTO,
    ) {
        val record = queryOneById<ProjectConstructionApproval>(id)
            ?: throw NotFoundException("工程建设审批不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除工程建设审批")
//@SaCheckPermission("project-construction-approval::delete")
    @DeleteMapping("{id}")
    fun deleteProjectConstructionApproval(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectConstructionApproval>(id)
        if (result == 0) throw NotFoundException("工程建设审批不存在")
    }

    @Operation(summary = "工程建设审批导入模板")
//@SaCheckPermission("project-construction-approval::create")
    @GetMapping("template.xlsx")
    fun getProjectConstructionApprovalImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectConstructionApprovalExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("工程建设审批导入模板.xlsx")
    }

    @Operation(summary = "批量导入工程建设审批")
//@SaCheckPermission("project-construction-approval::create")
    @PostMapping("import.xlsx")
    fun importProjectConstructionApproval(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectConstructionApprovalExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectConstructionApprovalExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectConstructionApprovalExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectConstructionApproval().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectConstructionApprovalExcelRow::class)
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

    @Operation(summary = "批量导出工程建设审批")
//@SaCheckPermission("project-construction-approval::query")
    @GetMapping("export.xlsx")
    fun exportProjectConstructionApproval(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectConstructionApprovalVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectConstructionApprovalMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectConstructionApprovalVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("工程建设审批导出.xlsx")
    }
}
