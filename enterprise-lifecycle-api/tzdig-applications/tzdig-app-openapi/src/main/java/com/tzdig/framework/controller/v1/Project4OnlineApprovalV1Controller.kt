package com.tzdig.framework.controller.v1

import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.like
import com.mybatisflex.kotlin.extensions.kproperty.notIn
import com.tzdig.framework.model.dto.ProjectOnlineApprovalDTO
import com.tzdig.framework.model.vo.ProjectOnlineApprovalVO
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestmentXOnlineApproval
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApproval
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.service.InvestOnlineService
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "招商项目绑定管理")
@RestController
@RequestMapping("v1/project/online-approval")
class Project4OnlineApprovalV1Controller(
    private val investOnlineService: InvestOnlineService,
) {
    @Operation(summary = "查询在线审批项目列表")
//    @SaCheckClientToken(scope = [ScopeConstant.PROJECT])
    @GetMapping
    @PageableQuery
    fun listProjectOnlineApproval(
        @Schema(description = "项目代码")
        @RequestParam(defaultValue = "") projectCode: String,
        @Schema(description = "项目名称")
        @RequestParam(defaultValue = "") projectName: String,
        @Schema(description = "申报单位联系人")
        @RequestParam(defaultValue = "") applicationCompanyContactName: String,
        @Schema(description = "联系人手机号")
        @RequestParam(defaultValue = "") applicationCompanyContactPhone: String,
        @Schema(description = "总投资（万元）")
        @RequestParam(required = false) totalInvestment: Float?,
        @Schema(description = "包含的招商项目ID")
        @RequestParam(defaultValue = "") includeInvestOnlineId: String,
        @Schema(description = "不包含的招商项目ID")
        @RequestParam(defaultValue = "") excludeInvestOnlineId: String,
    ): PageableResult<ProjectOnlineApprovalVO> {
        val include = if (includeInvestOnlineId.isEmpty()) null
        else investOnlineService.getOnlineApprovalByInvestmentOnlineId(includeInvestOnlineId)
        if (include != null && include.isEmpty()) return PageableResult.empty(pageable)
        val exclude = if (excludeInvestOnlineId.isEmpty()) null
        else investOnlineService.getOnlineApprovalByInvestmentOnlineId(excludeInvestOnlineId)
        val page = paginate<ProjectOnlineApproval>(pageable.pageNumber, pageable.pageSize) {
            if (projectCode.isNotEmpty()) and(ProjectOnlineApproval::projectCode eq projectCode)
            if (projectName.isNotEmpty()) and(ProjectOnlineApproval::projectName like projectName)
            if (applicationCompanyContactName.isNotEmpty()) and(ProjectOnlineApproval::applicationCompanyContactName like applicationCompanyContactName)
            if (applicationCompanyContactPhone.isNotEmpty()) and(ProjectOnlineApproval::applicationCompanyContactPhone like applicationCompanyContactPhone)
            if (totalInvestment != null) and(ProjectOnlineApproval::totalInvestment eq totalInvestment)
            if (!include.isNullOrEmpty()) and(ProjectOnlineApproval::id inList include)
            if (!exclude.isNullOrEmpty()) and(ProjectOnlineApproval::id notIn exclude)
        }.map(::ProjectOnlineApprovalVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "创建在线审批项目")
//    @SaCheckClientToken(scope = [ScopeConstant.PROJECT])
    @PostMapping
    fun createOrUpdateProjectOnlineApproval(
        @RequestBody dto: ProjectOnlineApprovalDTO,
    ): ProjectOnlineApprovalVO {
        var record = queryOneById<ProjectOnlineApproval>(dto.projectCode!!)
        if (record == null) {
            record = dto.toProjectOnlineApproval(dto.projectCode)
            record.save()
        } else {
            dto.into(record)
            record.updateById()
        }
        return ProjectOnlineApprovalVO(record)
    }

    @Operation(summary = "添加在线审批项目绑定")
//    @SaCheckClientToken(scope = [ScopeConstant.PROJECT])
    @PostMapping("{onlineApprovalId}/x-investment-online/{investOnlineId}")
    fun addProjectOnlineApprovalBind(
        @Schema(description = "在线审批ID")
        @PathVariable onlineApprovalId: String,
        @Schema(description = "招商项目ID")
        @PathVariable investOnlineId: String,
    ) {
        val investmentId = filterOne<ProjectDigitalInvestmentAttracting> {
            ProjectDigitalInvestmentAttracting::investOnlineId eq investOnlineId
        }?.id ?: investOnlineId
        val onlineApproval = queryOneById<ProjectOnlineApproval>(onlineApprovalId)
            ?: throw NotFoundException("在线审批项目不存在")
        queryOne<ProjectInvestmentXOnlineApproval> {
            where(ProjectInvestmentXOnlineApproval::onlineApprovalId eq onlineApprovalId)
        } ?: throw ApiException("该项目已被绑定")
        val record = queryOne<ProjectInvestmentXOnlineApproval> {
            where(ProjectInvestmentXOnlineApproval::investmentId eq investmentId)
            and(ProjectInvestmentXOnlineApproval::onlineApprovalId eq onlineApproval.id)
        }
        // if (record != null) throw ApiException("在线审批项目已绑定")
        if (record == null) {
            ProjectInvestmentXOnlineApproval {
                this.investmentId = investmentId
                this.onlineApprovalId = onlineApproval.id
                this.save()
            }
        }
    }

    @Operation(summary = "移除在线审批项目绑定")
//    @SaCheckClientToken(scope = [ScopeConstant.PROJECT])
    @DeleteMapping("{onlineApprovalId}/x-investment-online/{investOnlineId}")
    fun removeProjectOnlineApprovalBind(
        @Schema(description = "在线审批ID")
        @PathVariable onlineApprovalId: String,
        @Schema(description = "招商项目ID")
        @PathVariable investOnlineId: String,
    ) {
        val investmentId = filterOne<ProjectDigitalInvestmentAttracting> {
            ProjectDigitalInvestmentAttracting::investOnlineId eq investOnlineId
        }?.id ?: throw NotFoundException("招商项目不存在")
        val onlineApproval = queryOneById<ProjectOnlineApproval>(onlineApprovalId)
            ?: throw NotFoundException("在线审批项目不存在")
        val record = queryOne<ProjectInvestmentXOnlineApproval> {
            where(ProjectInvestmentXOnlineApproval::investmentId eq investmentId)
            and(ProjectInvestmentXOnlineApproval::onlineApprovalId eq onlineApproval.id)
        }
        // if (record == null) throw NotFoundException("在线审批项目未绑定")
        record?.removeById()
    }
}
