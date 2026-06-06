package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.deleteById
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.model.dto.ProjectDigitalServiceDTO
import com.tzdig.framework.model.vo.ProjectDigitalServiceVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalService
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "招商项目跟踪服务表管理")
@RestController
@RequestMapping("project-digital-service")
class ProjectDigitalServiceController {
    @Operation(summary = "查询招商项目跟踪服务表列表")
    //@SaCheckPermission("project-digital-service::query")
    @GetMapping
    @PageableQuery
    fun listProjectDigitalService(
        pageable: Pageable,
        @RequestParam(defaultValue = "") investmentId: String,
    ): PageableResult<ProjectDigitalServiceVO> {
        val page = paginate<ProjectDigitalService>(pageable.pageNumber, pageable.pageSize) {
            if (investmentId.isNotEmpty()) {
                and(ProjectDigitalService::digitalInvestmentId eq investmentId)
            }
        }.map(::ProjectDigitalServiceVO)
        if (page.totalRow == 0L) {
            return PageableResult.empty(pageable)
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "查询招商项目跟踪服务表")
    //@SaCheckPermission("project-digital-service::query")
    @GetMapping("{id}")
    fun getProjectDigitalService(
        @PathVariable id: String,
    ): ProjectDigitalServiceVO {
        val record = queryOneById<ProjectDigitalService>(id)
            ?: throw NotFoundException("招商项目跟踪服务表不存在")
        return ProjectDigitalServiceVO(record)
    }

    @Operation(summary = "创建招商项目跟踪服务表")
    //@SaCheckPermission("project-digital-service::create")
    @PostMapping
    fun createProjectDigitalService(
        @RequestBody dto: ProjectDigitalServiceDTO,
    ) {
        dto.toProjectDigitalService().save()
    }

    @Operation(summary = "修改招商项目跟踪服务表")
    //@SaCheckPermission("project-digital-service::update")
    @PutMapping("{id}")
    fun updateProjectDigitalService(
        @PathVariable id: String,
        @RequestBody dto: ProjectDigitalServiceDTO,
    ) {
        val record = queryOneById<ProjectDigitalService>(id)
            ?: throw NotFoundException("招商项目跟踪服务表不存在")
        dto.into(record).updateById()
    }

    @Operation(summary = "删除招商项目跟踪服务表")
    //@SaCheckPermission("project-digital-service::delete")
    @DeleteMapping("{id}")
    fun deleteProjectDigitalService(
        @PathVariable id: String,
    ) {
        val result = deleteById<ProjectDigitalService>(id)
        if (result == 0) throw NotFoundException("招商项目跟踪服务表不存在")
    }

}
