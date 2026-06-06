package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.*
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.model.dto.ExtZsProjectOperationDTO
import com.tzdig.framework.model.dto.ProjectDigitalDataChangelogDTO
import com.tzdig.framework.model.vo.ExtZsProjectOperationVO
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjectOperation
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.entity.zsxt.TProjType
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.service.DataChangeLogService
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "项目开工信息表管理")
@RestController
@RequestMapping("ext-zs-project-operation")
class ExtZsProjectOperationController(
    private val dataChangeLogService: DataChangeLogService
) {
    @Operation(summary = "查询项目开工信息表列表")
    //@SaCheckPermission("ext-zs-project-operation::query")
    @GetMapping
    @PageableQuery
    fun listExtZsProjectOperation(
        pageable: Pageable,
    ): PageableResult<ExtZsProjectOperationVO> {
        val page = paginate<ExtZsProjectOperation>(pageable.pageNumber, pageable.pageSize) {
            //TODO
        }.map(::ExtZsProjectOperationVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询项目开工信息表")
    //@SaCheckPermission("ext-zs-project-operation::query")
    @GetMapping("{zsid}")
    fun getExtZsProjectOperation(
        @PathVariable zsid: String,
    ): ExtZsProjectOperationVO {
        val digitalInvestment = queryOne<ProjectDigitalInvestmentAttracting> {
            where(ProjectDigitalInvestmentAttracting::id eq zsid)
        }
        val review = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId eq zsid)
            and(ProjectDigitalProjectReviewAll::step eq 4)
            orderBy(ProjectDigitalProjectReviewAll::createTime)
        }
        val record = queryOne<ExtZsProjectOperation> {
            where(ExtZsProjectOperation::id eq digitalInvestment?.investOnlineId)
        }
            ?: throw NotFoundException("招商平台签约项目表不存在")
        val result = ExtZsProjectOperationVO(record)
        result.projTypeLabel = filterOne<TProjType> { TProjType::code eq result.projType }?.name
        result.department = digitalInvestment?.sjjgName
        result.pType = digitalInvestment?.investmentFlag
        if (review.isNotEmpty()) {
            result.applyDate = review.first().createTime
        }
        return result
    }

    @Operation(summary = "创建项目开工信息表")
    //@SaCheckPermission("ext-zs-project-operation::create")
    @PostMapping
    fun createExtZsProjectOperation(
        @RequestBody dto: ExtZsProjectOperationDTO,
    ) {
        dto.toExtZsProjectOperation().save()
    }

    @Operation(summary = "修改项目开工信息表")
    //@SaCheckPermission("ext-zs-project-operation::update")
    @PutMapping("{id}")
    fun updateExtZsProjectOperation(
        @PathVariable id: String,
        @RequestBody dto: ExtZsProjectOperationDTO,
    ) {
        val record = queryOneById<ExtZsProjectOperation>(id)
            ?: throw NotFoundException("项目开工信息表不存在")
        val projectDigitalDataChangelogDTO = ProjectDigitalDataChangelogDTO(
            tableName = "ext_zs_project_operation",
            tableId = id,
            fieldName = "kgzzcl",
            oldValue = record.kgzzcl,
            newValue = dto.kgzzcl,
            author = null,
            changedAt = null,
        )
        dataChangeLogService.createDataChangeLog(projectDigitalDataChangelogDTO)
        dto.into(record).updateById()
    }

    @Operation(summary = "删除项目开工信息表")
    //@SaCheckPermission("ext-zs-project-operation::delete")
    @DeleteMapping("{id}")
    fun deleteExtZsProjectOperation(
        @PathVariable id: String,
    ) {
        val result = deleteById<ExtZsProjectOperation>(id)
        if (result == 0) throw NotFoundException("项目开工信息表不存在")
    }
}
