package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.likeRaw
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectOnlineApprovalInfoDTO
import com.tzdig.framework.model.dto.ProjectOnlineApprovalInfoExcelRow
import com.tzdig.framework.model.vo.OnlineApprovalProgressCountVO
import com.tzdig.framework.model.vo.ProjectOnlineApprovalInfoVO
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApprovalInfo
import com.tzdig.framework.mybatis.mapper.prime.ProjectOnlineApprovalInfoMapper
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.ExcelReadUtils
import com.tzdig.framework.web.util.ExcelWriteUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux

@Tag(name = "在线审批流程信息管理")
@RestController
@RequestMapping("project-online-approval-info")
class ProjectOnlineApprovalInfoController {
    @Operation(summary = "查询在线审批流程信息列表")
    //@SaCheckPermission("project-online-approval-info::query")
    @GetMapping
    @PageableQuery
    fun listProjectOnlineApprovalInfo(
        @Schema(description = "在线审批ID")
        onlineApprovalId: String,
        pageable: Pageable,
    ): PageableResult<ProjectOnlineApprovalInfoVO> {
        val page = paginate<ProjectOnlineApprovalInfo>(pageable.pageNumber, pageable.pageSize) {
            and(ProjectOnlineApprovalInfo::onlineApprovalId eq onlineApprovalId)
        }.map(::ProjectOnlineApprovalInfoVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询在线审批流程信息")
    //@SaCheckPermission("project-online-approval-info::query")
    @GetMapping("{id}")
    fun getProjectOnlineApprovalInfo(
        @PathVariable id: String,
    ): ProjectOnlineApprovalInfoVO {
        val record = queryOneById<ProjectOnlineApprovalInfo>(id)
            ?: throw NotFoundException("在线审批流程信息不存在")
        return ProjectOnlineApprovalInfoVO(record)
    }

    @Operation(summary = "创建在线审批流程信息")
    //@SaCheckPermission("project-online-approval-info::create")
    @PostMapping
    fun createProjectOnlineApprovalInfo(
        @RequestBody dto: ProjectOnlineApprovalInfoDTO,
    ) {
        dto.toProjectOnlineApprovalInfo().save()
    }

    @Operation(summary = "修改在线审批流程信息")
    //@SaCheckPermission("project-online-approval-info::update")
    @PutMapping("{id}")
    fun updateProjectOnlineApprovalInfo(
        @PathVariable id: String,
        @RequestBody dto: ProjectOnlineApprovalInfoDTO,
    ) {
        val record = queryOneById<ProjectOnlineApprovalInfo>(id)
            ?: throw NotFoundException("在线审批流程信息不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除在线审批流程信息")
    //@SaCheckPermission("project-online-approval-info::delete")
    @DeleteMapping("{id}")
    fun deleteProjectOnlineApprovalInfo(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectOnlineApprovalInfo>(id)
        if (result == 0) throw NotFoundException("在线审批流程信息不存在")
    }

    @Operation(summary = "在线审批流程信息导入模板")
    //@SaCheckPermission("project-online-approval-info::create")
    @GetMapping("template.xlsx")
    fun getProjectOnlineApprovalInfoImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectOnlineApprovalInfoExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("在线审批流程信息导入模板.xlsx")
    }

    @Operation(summary = "批量导入在线审批流程信息")
    //@SaCheckPermission("project-online-approval-info::create")
    @PostMapping("import.xlsx")
    fun importProjectOnlineApprovalInfo(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectOnlineApprovalInfoExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectOnlineApprovalInfoExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectOnlineApprovalInfoExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectOnlineApprovalInfo().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectOnlineApprovalInfoExcelRow::class)
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

    @Operation(summary = "批量导出在线审批流程信息")
    //@SaCheckPermission("project-online-approval-info::query")
    @GetMapping("export.xlsx")
    fun exportProjectOnlineApprovalInfo(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectOnlineApprovalInfoVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectOnlineApprovalInfoMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectOnlineApprovalInfoVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("在线审批流程信息导出.xlsx")
    }

    @Operation(summary = "在线审批流程进度")
    @GetMapping("{onlineApprovalId}/progress-count")
    fun progressCount(
        @PathVariable onlineApprovalId: String,
    ): OnlineApprovalProgressCountVO {
        val total = queryCount<ProjectOnlineApprovalInfo> {
            where(ProjectOnlineApprovalInfo::onlineApprovalId eq onlineApprovalId)
        }
        val completed = queryCount<ProjectOnlineApprovalInfo> {
            where(ProjectOnlineApprovalInfo::onlineApprovalId eq onlineApprovalId)
            where(ProjectOnlineApprovalInfo::approvalStatus likeRaw "已办结%")
        }
        return OnlineApprovalProgressCountVO(
            total = total,
            completed = completed,
        )
    }
}
