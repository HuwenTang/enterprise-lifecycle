package com.tzdig.framework.controller.fagai

import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.model.vo.ProjectFilingInfoVO
import com.tzdig.framework.mybatis.entity.prime.ProjectFilingInfo
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.service.InvestOnlineService
import com.tzdig.framework.web.exception.NotFoundException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.time.LocalDate

@Tag(name = "项目备案信息表管理")
@RestController
@RequestMapping("project-filing-info")
class ProjectFilingInfoController(
    private val investOnlineService: InvestOnlineService,
) {
    @Operation(summary = "查询项目备案信息表列表")
//    @SaCheckRole(SystemRole.ROOT, SystemRole.PROJECT_CITY,mode = SaMode.OR)
    @GetMapping
    @PageableQuery
    fun listProjectFilingInfo(
        pageable: Pageable,
//        @Schema(description = "年份")
//        @RequestParam year: Int,
//        @Schema(description = "月份")
//        @RequestParam month: Int?,
        @Schema(description = "开始时间")
        @RequestParam(required = false) start: LocalDate?,
        @Schema(description = "结束时间")
        @RequestParam(required = false) end: LocalDate?,
        @Schema(description = "市区")
        @RequestParam district: String?,
        @Schema(description = "园区")
        @RequestParam park: String?,
        @Schema(description = "所属行业1：工业、2：服务业")
        @RequestParam projectType: String?,
        @Schema(description = "金额范围min")
        @RequestParam(required = false) minAmount: Double?,
        @Schema(description = "金额范围max")
        @RequestParam(required = false) maxAmount: Double?,
        @Schema(description = "是否内资")
        @RequestParam(required = false) isInvestment: Boolean?,
        @Schema(description = "是否新增用地")
        @RequestParam(required = false) isAddLand: Boolean?,
        @Schema(description = "是否已供土地")
        @RequestParam(required = false) isLand: Boolean?,
        @Schema(description = "是否租用厂房")
        @RequestParam(required = false) isFactory: Boolean?,
        @Schema(description = "是否环评")
        @RequestParam(required = false) isEnvironment: Boolean?,
        @Schema(description = "是否能评")
        @RequestParam(required = false) isEnergy: Boolean?,
        @Schema(description = "是否安评")
        @RequestParam(required = false) isSecurity: Boolean?,
        @Schema(description = "是否施工图审查")
        @RequestParam(required = false) isMap: Boolean?,
        @Schema(description = "是否施工许可证")
        @RequestParam(required = false) isConstruction: Boolean?,
        @Schema(description = "是否规划许可")
        @RequestParam(required = false) isPlan: Boolean?,
        @Schema(description = "产业链群code")
        @RequestParam(defaultValue = "") industrialChain: String,
        @Schema(description = "是否全部产业链群")
        @RequestParam(required = false) isALLCluster: Boolean?,
    ): PageableResult<ProjectFilingInfoVO> {
        val page = paginate<ProjectFilingInfo>(pageable.pageNumber, pageable.pageSize) {
            val countyName = investOnlineService.getCountyName()
            and(ProjectFilingInfo::district inList countyName)
            if (projectType == "1") {
                and(ProjectFilingInfo::projectType eq "工业")
            } else if (projectType == "2") {
                and(ProjectFilingInfo::projectType eq "服务业")
            }
            if (district != null)
                and(ProjectFilingInfo::district eq district)
            if (park != null)
                and(ProjectFilingInfo::park eq park)
            if (start != null && end != null) {
                and(ProjectFilingInfo::completeFilingTime ge start)
                and(ProjectFilingInfo::completeFilingTime le end)
            }
            if (isInvestment == true)
                and(ProjectFilingInfo::isForeignInvestment eq false)
            else if (isInvestment == false)
                and(ProjectFilingInfo::isForeignInvestment eq true)
            if (isAddLand == true)
                and(ProjectFilingInfo::landUseType eq "新增用地")
            if (isAddLand == false)
                and(ProjectFilingInfo::landUseType ne "新增用地")
            if (isFactory == true)
                and(ProjectFilingInfo::landUseType eq "租用厂房")
            if (isLand == true) {
                and(ProjectFilingInfo::landUseType eq "新增用地")
                and(ProjectFilingInfo::landSupplyProgress like "土地摘牌")
            }
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
            if (isEnvironment == true) {
                and(ProjectFilingInfo::environmentalAssessmentStatus like "已完成")
            } else if (isEnvironment == false) {
                and(ProjectFilingInfo::environmentalAssessmentStatus like "未完成")
            }
            if (isEnergy == true) {
                and(ProjectFilingInfo::energyAssessmentStatus ne "3.未完成")
            } else if (isEnergy == false) {
                and(ProjectFilingInfo::energyAssessmentStatus like "未完成")
            }
            if (isSecurity == true) {
                and(ProjectFilingInfo::safetyAssessmentStatus like "已完成")
            } else if (isSecurity == false) {
                and(ProjectFilingInfo::safetyAssessmentStatus like "未完成")
            }
            if (isMap == true) {
                and(ProjectFilingInfo::constructionDrawingReviewStatus ne "3.未完成施工图审查")
            } else if (isMap == false) {
                and(ProjectFilingInfo::constructionDrawingReviewStatus like "未完成")
            }

            if (isConstruction == true) {
                and(ProjectFilingInfo::constructionPermitStatus like "已")
            } else if (isConstruction == false) {
                and(ProjectFilingInfo::constructionPermitStatus like "未")
            }
            if (isPlan == true) {
                and(ProjectFilingInfo::planning ne "2.未取得规划许可")
            } else if (isConstruction == false) {
                and(ProjectFilingInfo::planning eq "2.未取得规划许可")
            }
            if (industrialChain.isNotEmpty()) and {
                it.or(ProjectFilingInfo::innovativeCluster eq industrialChain)
                it.or(ProjectFilingInfo::industrialChain eq industrialChain)
            }
            if (isALLCluster == true) and {
                and(ProjectFilingInfo::innovativeCluster.isNotNull)
            }
        }.map(::ProjectFilingInfoVO)
        return PageableResult.of(page)
    }

    @Operation(summary = "查询项目备案信息表")
    //@SaCheckPermission("project-filing-info::query")
    @GetMapping("{id}")
    fun getProjectFilingInfo(
        @PathVariable id: String,
    ): ProjectFilingInfoVO {
        val record = queryOneById<ProjectFilingInfo>(id)
            ?: throw NotFoundException("项目备案信息表不存在")
        return ProjectFilingInfoVO(record)
    }
}
