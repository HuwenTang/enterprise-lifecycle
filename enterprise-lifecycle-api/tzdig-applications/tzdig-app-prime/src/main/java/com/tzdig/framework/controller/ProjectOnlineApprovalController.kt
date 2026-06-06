package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectOnlineApprovalDTO
import com.tzdig.framework.model.dto.ProjectOnlineApprovalExcelRow
import com.tzdig.framework.model.dto.ProjectOnlineApprovalParam
import com.tzdig.framework.model.vo.ProjectOnlineApprovalVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestmentXOnlineApproval
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApproval
import com.tzdig.framework.mybatis.mapper.prime.ProjectOnlineApprovalMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "在线审批项目管理")
@RestController
@RequestMapping("project-online-approval")
class ProjectOnlineApprovalController {
    @Operation(summary = "查询在线审批项目列表")
    //@SaCheckPermission("project-online-approval::query")
    @GetMapping
    @PageableQuery
    fun listProjectOnlineApproval(
        param: ProjectOnlineApprovalParam,
        pageable: Pageable,
    ): PageableResult<ProjectOnlineApprovalVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val ids = query<ProjectInvestmentXOnlineApproval> {
            join(ProjectDigitalInvestmentAttracting::class.java)
                .on(ProjectDigitalInvestmentAttracting::id eq ProjectInvestmentXOnlineApproval::investmentId)
            and {
                it.or(ProjectDigitalInvestmentAttracting::district inList grantedAreas)
                it.or(ProjectDigitalInvestmentAttracting::park inList grantedAreas)
            }
        }.map { it.onlineApprovalId!! }
        if (ids.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val page = paginate<ProjectOnlineApproval>(pageable.pageNumber, pageable.pageSize) {
            where(ProjectOnlineApproval::id inList ids)
            if (!param.projectCode.isNullOrEmpty()) {
                and(ProjectOnlineApproval::projectCode eq param.projectCode)
            }
            if (!param.projectName.isNullOrEmpty()) {
                and(ProjectOnlineApproval::projectName like param.projectName)
            }
            if (!param.approvalType.isNullOrEmpty()) {
                and(ProjectOnlineApproval::approvalType eq param.approvalType)
            }
            if (!param.constructionNature.isNullOrEmpty()) {
                and(ProjectOnlineApproval::constructionNature eq param.constructionNature)
            }
            if (!param.projectType.isNullOrEmpty()) {
                and(ProjectOnlineApproval::projectType eq param.projectType)
            }
            if (!param.isTechnicalReformProject.isNullOrEmpty()) {
                and(ProjectOnlineApproval::isTechnicalReformProject eq param.isTechnicalReformProject)
            }
            if (!param.industrialPolicyType.isNullOrEmpty()) {
                and(ProjectOnlineApproval::industrialPolicyType eq param.industrialPolicyType)
            }
            if (!param.isLegalCompanyControllingForProject.isNullOrEmpty()) {
                and(ProjectOnlineApproval::isLegalCompanyControllingForProject eq param.isLegalCompanyControllingForProject)
            }
        }.map(::ProjectOnlineApprovalVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询在线审批项目")
    //@SaCheckPermission("project-online-approval::query")
    @GetMapping("{id}")
    fun getProjectOnlineApproval(
        @PathVariable id: String,
    ): ProjectOnlineApprovalVO {
        val record = queryOneById<ProjectOnlineApproval>(id)
            ?: throw NotFoundException("在线审批项目不存在")
        return ProjectOnlineApprovalVO(record)
    }

    @Operation(summary = "通过code查询在线审批项目")
    //@SaCheckPermission("project-online-approval::query")
    @GetMapping("code")
    fun getProjectOnlineApprovalByCode(
        @Schema(description = "项目编号")
        @RequestParam(defaultValue = "") code: String,
    ): ProjectOnlineApprovalVO {
        val record = queryOne<ProjectOnlineApproval> {
            where(ProjectOnlineApproval::projectCode eq code)
        } ?: throw NotFoundException("在线审批项目不存在")
        return ProjectOnlineApprovalVO(record)
    }

    @Operation(summary = "创建在线审批项目")
    //@SaCheckPermission("project-online-approval::create")
    @PostMapping
    fun createProjectOnlineApproval(
        @RequestBody dto: ProjectOnlineApprovalDTO,
    ) {
        dto.toProjectOnlineApproval().save()
    }

    @Operation(summary = "修改在线审批项目")
    //@SaCheckPermission("project-online-approval::update")
    @PutMapping("{id}")
    fun updateProjectOnlineApproval(
        @PathVariable id: String,
        @RequestBody dto: ProjectOnlineApprovalDTO,
    ) {
        val record = queryOneById<ProjectOnlineApproval>(id)
            ?: throw NotFoundException("在线审批项目不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除在线审批项目")
    //@SaCheckPermission("project-online-approval::delete")
    @DeleteMapping("{id}")
    fun deleteProjectOnlineApproval(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectOnlineApproval>(id)
        if (result == 0) throw NotFoundException("在线审批项目不存在")
    }

    @Operation(summary = "在线审批项目导入模板")
    //@SaCheckPermission("project-online-approval::create")
    @GetMapping("template.xlsx")
    fun getProjectOnlineApprovalImportTemplate(): FileDownloadVO {
        val dictSheets = mapOf("yes_no" to listOf("是", "否"))
        val file = ExcelWriteUtils(ProjectOnlineApprovalExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), dictSheets)
        return file.downloadVO("在线审批项目导入模板.xlsx")
    }

    @Operation(summary = "批量导入在线审批项目")
    //@SaCheckPermission("project-online-approval::create")
    @PostMapping("import.xlsx")
    fun importProjectOnlineApproval(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectOnlineApprovalExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectOnlineApprovalExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectOnlineApprovalExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectOnlineApproval().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectOnlineApprovalExcelRow::class)
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

    @Operation(summary = "批量导出在线审批项目")
    //@SaCheckPermission("project-online-approval::query")
    @GetMapping("export.xlsx")
    fun exportProjectOnlineApproval(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectOnlineApprovalVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectOnlineApprovalMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectOnlineApprovalVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("在线审批项目导出.xlsx")
    }
}
