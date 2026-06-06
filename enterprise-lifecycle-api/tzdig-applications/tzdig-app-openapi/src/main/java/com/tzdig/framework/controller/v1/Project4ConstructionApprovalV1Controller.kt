package com.tzdig.framework.controller.v1

import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.mybatisflex.kotlin.extensions.kproperty.notIn
import com.tzdig.framework.model.dto.ProjectConstructionApprovalDTO
import com.tzdig.framework.model.vo.ProjectConstructionApprovalVO
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApproval
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestmentXConstructionApproval
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.service.InvestOnlineService
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "招商项目绑定管理")
@RestController
@RequestMapping("v1/project/construction-approval")
class Project4ConstructionApprovalV1Controller(
    private val investOnlineService: InvestOnlineService,
) {
    @Operation(summary = "查询工改项目列表")
//    @SaCheckClientToken(scope = [ScopeConstant.PROJECT])
    @GetMapping
    @PageableQuery
    fun listProjectConstructionApproval(
        @Schema(description = "项目代码")
        @RequestParam(defaultValue = "") projectCode: String,
        @Schema(description = "项目名称")
        @RequestParam(defaultValue = "") projectName: String,
        @Schema(description = "总投资（万元）")
        @RequestParam(required = false) totalInvestment: Float?,
        @Schema(description = "包含的招商项目ID")
        @RequestParam(defaultValue = "") includeInvestOnlineId: String,
        @Schema(description = "不包含的招商项目ID")
        @RequestParam(defaultValue = "") excludeInvestOnlineId: String,
    ): PageableResult<ProjectConstructionApprovalVO> {
        val include = if (includeInvestOnlineId.isEmpty()) null
        else investOnlineService.getConstructionApprovalByInvestmentOnlineId(includeInvestOnlineId)
        if (include != null && include.isEmpty()) return PageableResult.empty(pageable)
        val exclude = if (excludeInvestOnlineId.isEmpty()) null
        else investOnlineService.getConstructionApprovalByInvestmentOnlineId(excludeInvestOnlineId)
        val page = paginate<ProjectConstructionApproval>(pageable.pageNumber, pageable.pageSize) {
            if (projectCode.isNotEmpty()) and(ProjectConstructionApproval::projectCode eq projectCode)
            if (projectName.isNotEmpty()) and(ProjectConstructionApproval::projectName like projectName)
            if (totalInvestment != null) and(ProjectConstructionApproval::totalInvestment eq totalInvestment)
            if (!include.isNullOrEmpty()) and(ProjectConstructionApproval::id inList include)
            if (!exclude.isNullOrEmpty()) and(ProjectConstructionApproval::id notIn exclude)
        }.map(::ProjectConstructionApprovalVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "创建工改项目")
//    @SaCheckClientToken(scope = [ScopeConstant.PROJECT])
    @PostMapping
    fun createOrUpdateProjectConstructionApproval(
        @RequestBody dto: ProjectConstructionApprovalDTO,
    ): ProjectConstructionApprovalVO {
        var record = queryOneById<ProjectConstructionApproval>(dto.projectCode!!)
        if (record == null) {
            record = dto.toProjectConstructionApproval(dto.projectCode)
            record.save()
        } else {
            dto.into(record)
            record.updateById()
        }
        return ProjectConstructionApprovalVO(record)
    }

    @Operation(hidden = true)
    @PostMapping("investment-attracting-x-construction-approval")
    fun bindProjectConstructionApproval() = Unit

    @Operation(summary = "添加工改项目绑定")
//    @SaCheckClientToken(scope = [ScopeConstant.PROJECT])
    @PostMapping("{constructionApprovalId}/x-investment-online/{investOnlineId}")
    fun addProjectConstructionApprovalBind(
        @Schema(description = "工改ID")
        @PathVariable constructionApprovalId: String,
        @Schema(description = "招商项目ID")
        @PathVariable investOnlineId: String,
    ) {
        val investmentId = filterOne<ProjectDigitalInvestmentAttracting> {
            ProjectDigitalInvestmentAttracting::investOnlineId eq investOnlineId
        }?.id ?: investOnlineId
        val constructionApproval = queryOneById<ProjectConstructionApproval>(constructionApprovalId)
            ?: throw NotFoundException("工改项目不存在")
        val record = queryOne<ProjectInvestmentXConstructionApproval> {
            where(ProjectInvestmentXConstructionApproval::investmentId eq investmentId)
            and(ProjectInvestmentXConstructionApproval::constructionApprovalId eq constructionApproval.id)
        }
        // if (record != null) throw ApiException("工改项目已绑定")
        if (record == null) {
            ProjectInvestmentXConstructionApproval {
                this.investmentId = investmentId
                this.constructionApprovalId = constructionApproval.id
                this.save()
            }
        }
    }

    @Operation(summary = "移除工改项目绑定")
//    @SaCheckClientToken(scope = [ScopeConstant.PROJECT])
    @DeleteMapping("{constructionApprovalId}/x-investment-online/{investOnlineId}")
    fun removeProjectConstructionApprovalBind(
        @Schema(description = "工改ID")
        @PathVariable constructionApprovalId: String,
        @Schema(description = "招商项目ID")
        @PathVariable investOnlineId: String,
    ) {
        val investmentAttracting = filterOne<ProjectDigitalInvestmentAttracting> {
            ProjectDigitalInvestmentAttracting::investOnlineId eq investOnlineId
        } ?: throw NotFoundException("招商项目不存在")
        val constructionApproval = queryOneById<ProjectConstructionApproval>(constructionApprovalId)
            ?: throw NotFoundException("工改项目不存在")
        val record = queryOne<ProjectInvestmentXConstructionApproval> {
            where(ProjectInvestmentXConstructionApproval::investmentId eq investmentAttracting.id)
            and(ProjectInvestmentXConstructionApproval::constructionApprovalId eq constructionApproval.id)
        }
        // if (record == null) throw NotFoundException("工改项目未绑定")
        record?.removeById()
    }
}
