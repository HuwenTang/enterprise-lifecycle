package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.kotlin.extensions.db.paginate
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.model.vo.EnterpriseGdpVO
import com.tzdig.framework.model.vo.ParkGdpVO
import com.tzdig.framework.mybatis.entity.prime.EnterpriseEconomicInfo
import com.tzdig.framework.mybatis.entity.prime.EnterpriseInfo
import com.tzdig.framework.mybatis.entity.system.SystemArea
import com.tzdig.framework.mybatis.pageable.Pageable
import com.tzdig.framework.mybatis.pageable.PageableQuery
import com.tzdig.framework.mybatis.pageable.PageableResult
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.util.EnterpriseEconomyUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "GDP统计")
@RestController
@RequestMapping("gdp")
class EnterpriseGdpController {
    @Operation(summary = "查询GDP")
    @GetMapping("{year}")
    @PageableQuery
    fun getGdpList(
        @Schema(description = "年份")
        @PathVariable year: Int,
        @Schema(description = "产业集群")
        @RequestParam(defaultValue = "") innovativeCluster: String,
        @Schema(description = "未来产业")
        @RequestParam(required = false) futureIndustry: Boolean?,
        pageable: Pageable,
    ): PageableResult<EnterpriseGdpVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val quarter = EnterpriseEconomyUtils.getLastQuarter(year)
        val page = paginate<EnterpriseGdpVO>(pageable.pageNumber, pageable.pageSize) {
            and {
                it.or(EnterpriseInfo::district inList grantedAreas)
                it.or(EnterpriseInfo::park inList grantedAreas)
            }
            leftJoin(EnterpriseEconomicInfo::class.java)
                .on(EnterpriseInfo::id eq EnterpriseEconomicInfo::id)
            leftJoin(SystemArea::class.java)
                .on(EnterpriseInfo::park eq SystemArea::id)
            val actualValueField = EnterpriseEconomyUtils.getRevenueField(year, quarter)!!
            val actualValueField4tb = EnterpriseEconomyUtils.getRevenueField(year - 1, quarter)
            select(
                EnterpriseInfo::id.`as`(EnterpriseGdpVO::uscc.name),
                EnterpriseInfo::name.`as`(EnterpriseGdpVO::name.name),
                EnterpriseInfo::park.`as`(EnterpriseGdpVO::park.name),
                SystemArea::name.`as`(EnterpriseGdpVO::parkLabel.name),
                QueryMethods.if_(
                    actualValueField.isNull,
                    QueryMethods.null_(),
                    actualValueField.div(100_000)
                ).`as`(EnterpriseGdpVO::actualValue.name),
                if (actualValueField4tb == null) QueryMethods.null_() else {
                    QueryMethods.if_(
                        actualValueField4tb.isNull,
                        QueryMethods.null_(),
                        actualValueField4tb.div(100_000)
                    )
                }.`as`(EnterpriseGdpVO::actualValue4tb.name)
            )
//            if (industrialSystem.isNotEmpty()) {
//                and(EnterpriseInfo::industrialSystem eq industrialSystem)
//            } else {
//                and {
//                    it.and(EnterpriseInfo::industrialSystem.isNotNull)
//                    it.or(EnterpriseInfo::futureIndustry.isNotNull)
//                }
//            }
            if (innovativeCluster.isNotEmpty()) {
                and(EnterpriseInfo::innovativeCluster eq innovativeCluster)
            } else {
                and {
                    it.and(EnterpriseInfo::innovativeCluster.isNotNull)
                    it.or(EnterpriseInfo::futureIndustry.isNotNull)
                }
            }
            if (futureIndustry == true) {
                and(EnterpriseInfo::futureIndustry.isNotNull)
            } else if (futureIndustry == false) {
                and(EnterpriseInfo::futureIndustry.isNull)
            }
            orderBy(EnterpriseGdpVO::actualValue.name, false)
        }
        return PageableResult.of(page)
    }

    @Operation(summary = "按板块查询GDP")
    @GetMapping("{year}/by-park")
    @PageableQuery
    fun getGdpListByPark(
        @Schema(description = "年份")
        @PathVariable year: Int,
        pageable: Pageable,
    ): PageableResult<ParkGdpVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) {
            return PageableResult.empty(pageable)
        }
        val quarter = EnterpriseEconomyUtils.getLastQuarter(year)
        val page = paginate<ParkGdpVO>(pageable.pageNumber, pageable.pageSize) {
            and {
                it.or(EnterpriseInfo::district inList grantedAreas)
                it.or(EnterpriseInfo::park inList grantedAreas)
            }
            leftJoin(EnterpriseEconomicInfo::class.java)
                .on(EnterpriseInfo::id eq EnterpriseEconomicInfo::id)
            leftJoin(SystemArea::class.java)
                .on(EnterpriseInfo::park eq SystemArea::id)
            val actualValueField = EnterpriseEconomyUtils.getRevenueField(year, quarter)!!
            select(
                EnterpriseInfo::park.`as`(ParkGdpVO::park.name),
                SystemArea::name.`as`(ParkGdpVO::parkLabel.name),
                QueryMethods.count().`as`(ParkGdpVO::groupCount.name),
                QueryMethods.sum(actualValueField.div(10_000))
                    .`as`(ParkGdpVO::actualValue.name)
            )
            and(EnterpriseInfo::park.isNotNull)
            groupBy(ParkGdpVO::park.name, ParkGdpVO::parkLabel.name)
            orderBy(ParkGdpVO::actualValue.name, false)
        }
        return PageableResult.of(page)
    }
}
