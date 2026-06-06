package com.tzdig.framework.controller

import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.core.query.RawQueryColumn
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.model.vo.IndustrialSystemVO
import com.tzdig.framework.mybatis.entity.prime.EnterpriseEconomicInfo
import com.tzdig.framework.mybatis.entity.prime.EnterpriseInfo
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.util.EnterpriseEconomyUtils
import com.tzdig.framework.util.EnterpriseEconomyUtils.getLastQuarter
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "产业体系指标")
@RestController
@RequestMapping("industrial-system")
class IndustrialSystemController {
    @Operation(summary = "查询产体系指标")
    @GetMapping("{year}")
    fun fetchIndustrialSystemActualValue(
        @PathVariable year: Int,
    ): List<IndustrialSystemVO> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) {
            return emptyList()
        }
        val quarter = getLastQuarter(year)
        val actualValueField = EnterpriseEconomyUtils.getRevenueField(year, quarter)!!
        val actualValueField4tb = EnterpriseEconomyUtils.getRevenueField(year - 1, quarter)
        val list = query<IndustrialSystemVO> {
            and {
                it.or(EnterpriseInfo::district inList grantedAreas)
                it.or(EnterpriseInfo::park inList grantedAreas)
            }
            select(
                EnterpriseInfo::innovativeCluster
                    .`as`(IndustrialSystemVO::innovativeCluster.name),
                QueryMethods.count().`as`(IndustrialSystemVO::count.name),
                QueryMethods.sum(actualValueField.div(100_000))
                    .`as`(IndustrialSystemVO::actualValue.name),
                if (actualValueField4tb == null) QueryMethods.null_() else {
                    QueryMethods.sum(actualValueField4tb.div(100_000))
                }.`as`(IndustrialSystemVO::actualValue4tb.name)
            )
            innerJoin(EnterpriseEconomicInfo::class.java)
                .on(EnterpriseInfo::id eq EnterpriseEconomicInfo::id)
            groupBy(EnterpriseInfo::innovativeCluster)
        }
        val ext = queryOne<IndustrialSystemVO> {
            and {
                it.or(EnterpriseInfo::district inList grantedAreas)
                it.or(EnterpriseInfo::park inList grantedAreas)
            }
            select(
                RawQueryColumn("'未来产业'")
                    .`as`(IndustrialSystemVO::innovativeCluster.name),
                QueryMethods.count().`as`(IndustrialSystemVO::count.name),
                QueryMethods.sum(actualValueField.div(100_000))
                    .`as`(IndustrialSystemVO::actualValue.name),
                if (actualValueField4tb == null) QueryMethods.null_() else {
                    QueryMethods.sum(actualValueField4tb.div(100_000))
                }.`as`(IndustrialSystemVO::actualValue4tb.name)
            )
            innerJoin(EnterpriseEconomicInfo::class.java)
                .on(EnterpriseInfo::id eq EnterpriseEconomicInfo::id)
            and(EnterpriseInfo::futureIndustry.isNotNull)
        }
        val innovativeClusterSort = arrayOf(
            "生物医药",
            "健康食品",
            "海工装备和高技术船舶",
            "汽车及零部件",
            "新一代信息技术和智能装备",
            "化工及新材料",
            "金属新材料及制品",
            "新能源",
        )
        val newList = innovativeClusterSort.map { name ->
            list.find { it.innovativeCluster == name }
                ?: IndustrialSystemVO(innovativeCluster = name)
        }.toTypedArray()
        val subject = IndustrialSystemVO(
            innovativeCluster = "8+13+X",
            count = list.filter { it.innovativeCluster != null }.sumOf(IndustrialSystemVO::count),
            actualValue = list.filter { it.innovativeCluster != null }
                .sumOf { it.actualValue ?: 0.0 },
            actualValue4tb = list.filter { it.innovativeCluster != null }
                .sumOf { it.actualValue4tb ?: 0.0 },
        )
        return listOf(subject, *newList, ext ?: IndustrialSystemVO(innovativeCluster = "未来产业"))
            .onEachIndexed { index, item -> item.index = index }
    }
}
