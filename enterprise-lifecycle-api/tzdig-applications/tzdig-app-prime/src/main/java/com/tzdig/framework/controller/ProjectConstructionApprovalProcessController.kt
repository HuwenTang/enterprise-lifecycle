package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.model.vo.ProjectConstructionApprovalProcessVO
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApprovalProcess
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "审批流程记录表管理")
@RestController
@RequestMapping("project-construction-approval-process")
class ProjectConstructionApprovalProcessController {
    @Operation(summary = "查询审批流程记录表列表")
    //@SaCheckPermission("project-construction-approval-process::query")
    @GetMapping
    @PageableQuery
    fun listProjectConstructionApprovalProcess(
        @Schema(description = "projectCode")
        @RequestParam(defaultValue = "") projectCode: String,
        @Schema(description = "itemCode")
        @RequestParam(defaultValue = "") itemCode: String,
        pageable: Pageable,
    ): PageableResult<ProjectConstructionApprovalProcessVO> {
        val page = paginate<ProjectConstructionApprovalProcess>(pageable.pageNumber, pageable.pageSize) {
            if (projectCode.isNotEmpty() && itemCode.isNotEmpty()) {
                and(ProjectConstructionApprovalProcess::projectCode eq projectCode)
                and(ProjectConstructionApprovalProcess::itemCode eq itemCode)
            }
            orderBy(ProjectConstructionApprovalProcess::finishTime).desc()
        }.map(::ProjectConstructionApprovalProcessVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询审批流程记录表")
    //@SaCheckPermission("project-construction-approval-process::query")
    @GetMapping("{id}")
    fun getProjectConstructionApprovalProcess(
        @PathVariable id: String,
    ): ProjectConstructionApprovalProcessVO {
        val record = queryOneById<ProjectConstructionApprovalProcess>(id)
            ?: throw NotFoundException("审批流程记录表不存在")
        return ProjectConstructionApprovalProcessVO(record)
    }

    @Operation(summary = "删除审批流程记录表")
    //@SaCheckPermission("project-construction-approval-process::delete")
    @DeleteMapping("{id}")
    fun deleteProjectConstructionApprovalProcess(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectConstructionApprovalProcess>(id)
        if (result == 0) throw NotFoundException("审批流程记录表不存在")
    }
}
