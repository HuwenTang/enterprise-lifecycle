package com.tzdig.framework.controller.fagai

import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.model.vo.ProjectFagaiKeyProjectsVO
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiKeyProjects
import com.tzdig.framework.mybatis.pageable.Pageable.Companion.pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.service.InvestOnlineService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.time.LocalDate

@Tag(name = "市级重点项目全量信息表（含产业链、投资、建设、统计信息）管理")
@RestController
@RequestMapping("project-fagai-key-projects")
class ProjectFagaiKeyProjectsController(private val investOnlineService: InvestOnlineService) {
    @Operation(summary = "查询市级重点项目全量信息表（含产业链、投资、建设、统计信息）列表")
    //@SaCheckPermission("project-fagai-key-projects::query")
    @GetMapping
    @PageableQuery
    fun listProjectFagaiKeyProjects(
        @Schema(description = "年份")
        @RequestParam(required = false) year: Int?,
        @Schema(description = "月份")
        @RequestParam(required = false) month: Int?,
        @Schema(description = "市（区）")
        @RequestParam("city", defaultValue = "") district: String,
        @Schema(description = "园区")
        @RequestParam(defaultValue = "") park: String,
        @Schema(description = "产业链群是否非空")
        @RequestParam(defaultValue = "false") industrialChainNotNull: Boolean,
        @Schema(description = "产业链群code")
        @RequestParam(defaultValue = "") industrialChain: String,
        @Schema(description = "项目类型: 1=市级重点 2=一亿元 3=十亿元 4=全部")
        @RequestParam(required = false) type: Int?,
        @Schema(description = "状态: 1=开工 2=竣工 3=在建")
        @RequestParam(required = false) status: Int?,
        @Schema(description = "是否为内资项目")
        @RequestParam(required = false) isDomestic: Boolean?,
        @Schema(description = "是否为外资项目")
        @RequestParam(required = false) isForeign: Boolean?,
        @Schema(description = "金额范围min")
        @RequestParam(required = false) minAmount: Double?,
        @Schema(description = "金额范围max")
        @RequestParam(required = false) maxAmount: Double?,
        @Schema(description = "开始时间")
        @RequestParam(required = false) startDate: LocalDate?,
        @Schema(description = "结束时间")
        @RequestParam(required = false) endDate: LocalDate?,
    ): PageableResult<ProjectFagaiKeyProjectsVO> {
        val page = paginate<ProjectFagaiKeyProjects>(pageable.pageNumber, pageable.pageSize) {
            var countyCode = investOnlineService.getCountyCode()
            if (countyCode.isNotEmpty()) {
                and(ProjectFagaiKeyProjects::district inList countyCode)
            } else {
                countyCode = DataGrantsUtils.grantedAreas.toList()
                and(ProjectFagaiKeyProjects::park inList countyCode)
            }
            if (district.isNotEmpty())
                and(ProjectFagaiKeyProjects::district eq district)
            if (park.isNotEmpty())
                and(ProjectFagaiKeyProjects::park eq park)
            if (industrialChainNotNull)
                and(ProjectFagaiKeyProjects::industrialChain.isNotNull)
            if (industrialChain.isNotEmpty()) and {
                it.or(ProjectFagaiKeyProjects::innovativeCluster eq industrialChain)
                it.or(ProjectFagaiKeyProjects::industrialChain eq industrialChain)
            }
            when (type) {
                1 -> and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
                2 -> and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
                3 -> and(ProjectFagaiKeyProjects::isOverTenBillion eq true)
            }
            if (isDomestic == true) {
                and(ProjectFagaiKeyProjects::plannedTotalInvestmentDomestic.isNotNull)
                and(ProjectFagaiKeyProjects::plannedTotalInvestmentDomestic gt BigDecimal.ZERO)
            }
            if (isForeign == true) {
                and(ProjectFagaiKeyProjects::plannedTotalInvestmentForeign.isNotNull)
                and(ProjectFagaiKeyProjects::plannedTotalInvestmentForeign gt BigDecimal.ZERO)
            }
            if (minAmount != null)
                and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le BigDecimal.valueOf(maxAmount))
            val dateField = when (status) {
                1 -> {
                    and(ProjectFagaiKeyProjects::projectType eq 1)
                    ProjectFagaiKeyProjects::startDate
                }

                2 -> {
                    and(ProjectFagaiKeyProjects::projectType eq 2)
                    ProjectFagaiKeyProjects::completionDate
                }

                3 -> {
                    and(ProjectFagaiKeyProjects::projectType eq 1)
                    and(ProjectFagaiKeyProjects::isUnderConstruction eq true)
                    ProjectFagaiKeyProjects::startDate
                }

                else -> null
            }
            if (dateField != null) {
                if (startDate != null)
                    and(dateField ge startDate)
                if (endDate != null)
                    and(dateField le endDate)
                if (year != null) {
                    if (month == null) {
                        val startDate = LocalDate.of(year, 1, 1)
                        val endDate = LocalDate.of(year, 12, 31)
                        and(dateField between startDate..endDate)
                    } else {
                        val startDate = LocalDate.of(year, month, 1)
                        val endDate = startDate.plusMonths(1).minusDays(1)
                        and(dateField between startDate..endDate)
                    }
                }
            }
        }.map(::ProjectFagaiKeyProjectsVO)
        return PageableResult.of(page)
    }
}
