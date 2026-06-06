package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.model.dto.ProjectAppealCommentDTO
import com.tzdig.framework.model.vo.ProjectAppealCommentVO
import com.tzdig.framework.mybatis.entity.prime.ProjectAppealComment
import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "项目申诉管理")
@RestController
@RequestMapping("project-appeal-comment")
class ProjectAppealCommentController {
    @Operation(summary = "查询项目申诉意见列表")
    //@SaCheckPermission("project-appeal-comment::query")
    @GetMapping
    @PageableQuery
    fun listProjectAppealComment(
        @RequestParam appealId: String,
    ): List<ProjectAppealCommentVO> {
        val list = query<ProjectAppealComment> {
            where(ProjectAppealComment::appealId eq appealId)
            orderBy(ProjectAppealComment::createTime).desc()
        }
        return list.map {
            val vo = ProjectAppealCommentVO(it)
            vo.userName = queryOneById<UserAccount>(it.userid!!)?.realName ?: ""
            vo
        }
    }

    @Operation(summary = "查询项目申诉意见")
    //@SaCheckPermission("project-appeal-comment::query")
    @GetMapping("{id}")
    fun getProjectAppealComment(
        @PathVariable id: String,
    ): ProjectAppealCommentVO {
        val record = queryOneById<ProjectAppealComment>(id)
            ?: throw NotFoundException("项目申诉意见不存在")
        return ProjectAppealCommentVO(record)
    }

    @Operation(summary = "创建项目申诉意见")
    //@SaCheckPermission("project-appeal-comment::create")
    @PostMapping
    fun createProjectAppealComment(
        @RequestBody dto: ProjectAppealCommentDTO,
    ) {
        dto.toProjectAppealComment().save()
    }

    @Operation(summary = "修改项目申诉意见")
    //@SaCheckPermission("project-appeal-comment::update")
    @PutMapping("{id}")
    fun updateProjectAppealComment(
        @PathVariable id: String,
        @RequestBody dto: ProjectAppealCommentDTO,
    ) {
        val record = queryOneById<ProjectAppealComment>(id)
            ?: throw NotFoundException("项目申诉意见不存在")
        dto.into(record).updateById()
    }
}
