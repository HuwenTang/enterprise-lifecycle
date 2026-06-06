package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryWrapper
import com.mybatisflex.core.row.Db
import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.mapper
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.file.model.vo.ExcelImportResultVO
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.model.vo.FileDownloadVO.Companion.downloadVO
import com.tzdig.framework.file.util.createNewTempFile
import com.tzdig.framework.file.util.tempFile
import com.tzdig.framework.model.dto.ProjectOnlineApprovalInfoDetailDTO
import com.tzdig.framework.model.dto.ProjectOnlineApprovalInfoDetailExcelRow
import com.tzdig.framework.model.vo.ProjectOnlineApprovalInfoDetailVO
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApprovalInfoDetail
import com.tzdig.framework.mybatis.mapper.prime.ProjectOnlineApprovalInfoDetailMapper
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

@Tag(name = "在线审批流程信息详情管理")
@RestController
@RequestMapping("project-online-approval-info-detail")
class ProjectOnlineApprovalInfoDetailController {
    @Operation(summary = "查询在线审批流程信息详情列表")
    //@SaCheckPermission("project-online-approval-info-detail::query")
    @GetMapping
    @PageableQuery
    fun listProjectOnlineApprovalInfoDetail(
        @Schema(description = "在线审批ID")
        onlineApprovalId: String,
        @Schema(description = "在线审批流程信息ID")
        onlineApprovalInfoId: String,
        pageable: Pageable,
    ): PageableResult<ProjectOnlineApprovalInfoDetailVO> {
        val page = paginate<ProjectOnlineApprovalInfoDetail>(pageable.pageNumber, pageable.pageSize) {
            and(ProjectOnlineApprovalInfoDetail::onlineApprovalId eq onlineApprovalId)
            and(ProjectOnlineApprovalInfoDetail::onlineApprovalInfoId eq onlineApprovalInfoId)
        }.map(::ProjectOnlineApprovalInfoDetailVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询在线审批流程信息详情")
    //@SaCheckPermission("project-online-approval-info-detail::query")
    @GetMapping("{id}")
    fun getProjectOnlineApprovalInfoDetail(
        @PathVariable id: String,
    ): ProjectOnlineApprovalInfoDetailVO {
        val record = queryOneById<ProjectOnlineApprovalInfoDetail>(id)
            ?: throw NotFoundException("在线审批流程信息详情不存在")
        return ProjectOnlineApprovalInfoDetailVO(record)
    }

    @Operation(summary = "创建在线审批流程信息详情")
    //@SaCheckPermission("project-online-approval-info-detail::create")
    @PostMapping
    fun createProjectOnlineApprovalInfoDetail(
        @RequestBody dto: ProjectOnlineApprovalInfoDetailDTO,
    ) {
        dto.toProjectOnlineApprovalInfoDetail().save()
    }

    @Operation(summary = "修改在线审批流程信息详情")
    //@SaCheckPermission("project-online-approval-info-detail::update")
    @PutMapping("{id}")
    fun updateProjectOnlineApprovalInfoDetail(
        @PathVariable id: String,
        @RequestBody dto: ProjectOnlineApprovalInfoDetailDTO,
    ) {
        val record = queryOneById<ProjectOnlineApprovalInfoDetail>(id)
            ?: throw NotFoundException("在线审批流程信息详情不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除在线审批流程信息详情")
    //@SaCheckPermission("project-online-approval-info-detail::delete")
    @DeleteMapping("{id}")
    fun deleteProjectOnlineApprovalInfoDetail(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectOnlineApprovalInfoDetail>(id)
        if (result == 0) throw NotFoundException("在线审批流程信息详情不存在")
    }

    @Operation(summary = "在线审批流程信息详情导入模板")
    //@SaCheckPermission("project-online-approval-info-detail::create")
    @GetMapping("template.xlsx")
    fun getProjectOnlineApprovalInfoDetailImportTemplate(): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectOnlineApprovalInfoDetailExcelRow::class)
            .writeTemplate(createNewTempFile("xlsx"), emptyMap(/*TODO*/))
        return file.downloadVO("在线审批流程信息详情导入模板.xlsx")
    }

    @Operation(summary = "批量导入在线审批流程信息详情")
    //@SaCheckPermission("project-online-approval-info-detail::create")
    @PostMapping("import.xlsx")
    fun importProjectOnlineApprovalInfoDetail(
        @RequestPart file: MultipartFile,
    ): ExcelImportResultVO {
        val tempFile = file.tempFile(".xlsx")
        try {
            val flux1: Flux<ProjectOnlineApprovalInfoDetailExcelRow> =
                ExcelReadUtils.readFlux(tempFile, ProjectOnlineApprovalInfoDetailExcelRow::class)
            val totalCount = flux1.count().block() ?: 0
            val flux2: Flux<ProjectOnlineApprovalInfoDetailExcelRow> = flux1.mapNotNull {
                try {
                    it.verify()
                    it.toProjectOnlineApprovalInfoDetail().save()
                    null
                } catch (e: IllegalArgumentException) {
                    it.failReason = e.message
                    it
                }
            }
            val failCount = flux2.count().block() ?: 0
            val file = if (failCount == 0L) null else {
                ExcelWriteUtils(ProjectOnlineApprovalInfoDetailExcelRow::class)
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

    @Operation(summary = "批量导出在线审批流程信息详情")
    //@SaCheckPermission("project-online-approval-info-detail::query")
    @GetMapping("export.xlsx")
    fun exportProjectOnlineApprovalInfoDetail(
        @RequestParam(defaultValue = "") fields: Set<String>,
    ): FileDownloadVO {
        val file = ExcelWriteUtils(ProjectOnlineApprovalInfoDetailVO::class)
            .writeWith(createNewTempFile("xlsx"), fields) {
                val mapper = mapper<ProjectOnlineApprovalInfoDetailMapper>()
                Flux.create { emitter ->
                    Db.tx {
                        val records = mapper.selectCursorByQuery(QueryWrapper())
                        for (record in records) emitter.next(ProjectOnlineApprovalInfoDetailVO(record))
                        emitter.complete()
                        true
                    }
                }
            }
        return file.downloadVO("在线审批流程信息详情导出.xlsx")
    }
}
