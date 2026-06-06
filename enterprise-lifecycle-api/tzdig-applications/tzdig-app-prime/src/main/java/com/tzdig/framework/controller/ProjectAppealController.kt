package com.tzdig.framework.controller

import cn.dev33.satoken.stp.StpUtil
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.model.dto.ProjectAppealApprovalDTO
import com.tzdig.framework.model.dto.ProjectAppealDTO
import com.tzdig.framework.model.vo.ProjectAppealVO
import com.tzdig.framework.mybatis.entity.prime.ProjectAppeal
import com.tzdig.framework.mybatis.entity.prime.ProjectAppealComment
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.web.exception.NotFoundException
import com.tzdig.framework.web.util.DictUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@Tag(name = "项目申诉管理")
@RestController
@RequestMapping("project-appeal")
class ProjectAppealController(
    private val userService: UserService,
) {
    @Operation(summary = "查询项目申诉列表")
    //@SaCheckPermission("project-appeal::query")
    @GetMapping
    @PageableQuery
    fun listProjectAppeal(
        @RequestParam(defaultValue = "") projectName: String,
        @RequestParam(defaultValue = "") sjjgName: String,
        @RequestParam(required = false) startTime: LocalDate?,
        @RequestParam(required = false) endTime: LocalDate?,
        @RequestParam(defaultValue = "") status: String,
    ): PageableResult<ProjectAppealVO> {
        val deptList = when {
            StpUtil.hasRole(SystemRole.ROOT) -> null
            StpUtil.hasRole(SystemRole.THREE_BIG_GRAB) -> null
            StpUtil.hasRole(SystemRole.DEPARTMENT_PROJECT) ->
                userService.getCobsByUserid(userAccount.id!!)
                    .map { DictUtils.getDictLabelByCode("project_dept", it) }

            else -> return PageableResult.empty(pageable)
        }
        if (deptList != null && deptList.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val page = paginate<ProjectAppeal>(pageable.pageNumber, pageable.pageSize) {
            if (deptList != null) and(ProjectAppeal::sjjgName inList deptList)
            if (projectName.isNotEmpty()) and(ProjectAppeal::projectName like projectName)
            if (sjjgName.isNotEmpty()) and(ProjectAppeal::sjjgName like sjjgName)
            if (status.isNotEmpty()) and(ProjectAppeal::status eq status)
            if (startTime != null) and(ProjectAppeal::createTime ge startTime.atStartOfDay())
            if (endTime != null) and(ProjectAppeal::createTime lt endTime.plusDays(1).atStartOfDay())
            orderBy(ProjectAppeal::createTime).desc()
        }.map(::ProjectAppealVO)
        page.records.forEach {
            it.appealer = userService.getUserAccountById(it.userid)?.realName ?: ""
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "查询项目申诉")
    //@SaCheckPermission("project-appeal::query")
    @GetMapping("{id}")
    fun getProjectAppeal(
        @PathVariable id: String,
    ): ProjectAppealVO {
        val record = queryOneById<ProjectAppeal>(id)
            ?: throw NotFoundException("项目申诉不存在")
        val vo = ProjectAppealVO(record)
        vo.appealer = userService.getUserAccountById(vo.userid)?.realName ?: ""
        return vo
    }

    @Operation(summary = "创建项目申诉")
    //@SaCheckPermission("project-appeal::create")
    @PostMapping
    fun createProjectAppeal(
        @RequestBody dto: ProjectAppealDTO,
    ) {
        dto.toProjectAppeal().save()
    }

    @Operation(summary = "修改项目申诉")
    //@SaCheckPermission("project-appeal::update")
    @PutMapping("{id}")
    fun updateProjectAppeal(
        @PathVariable id: String,
        @RequestBody dto: ProjectAppealDTO,
    ) {
        val record = queryOneById<ProjectAppeal>(id)
            ?: throw NotFoundException("项目申诉不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "处理项目申诉")
    @PostMapping("{id}/comment")
    fun handleProjectAppeal(
        @PathVariable id: String,
        @RequestBody dto: ProjectAppealApprovalDTO,
    ) {
        val record = queryOneById<ProjectAppeal>(id)
            ?: throw NotFoundException("项目申诉不存在")
        record.status = if (dto.result) ProjectAppeal.Status.RESOLVED else ProjectAppeal.Status.REJECT
        record.updateById()
        ProjectAppealComment {
            appealId = id
            userid = userAccount.id
            content = dto.content
        }.save()
    }
}
