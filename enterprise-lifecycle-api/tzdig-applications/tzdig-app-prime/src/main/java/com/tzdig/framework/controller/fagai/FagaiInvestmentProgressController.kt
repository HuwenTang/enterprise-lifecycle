package com.tzdig.framework.controller.fagai

import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.model.vo.fagai.*
import com.tzdig.framework.service.FagaiProjectService
import com.tzdig.framework.web.util.SettingsUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.time.LocalDate

@Tag(name = "发改-投资进度")
@RestController
@RequestMapping("fagai/investment")
class FagaiInvestmentProgressController(
    private val fagaiProjectService: FagaiProjectService,
) {
    @Operation(summary = "投资进度")
    @GetMapping("overview")
    fun getInvestmentOverview(
        @Schema(description = "是否为市级重点项目")
        @RequestParam isMunicipalKey: Boolean,
        @Schema(description = "是否为亿元以上项目")
        @RequestParam isOverOneBillion: Boolean,
        @Schema(description = "金额范围（万元）")
        @RequestParam(required = false) minAmount: BigDecimal?,
        @Schema(description = "金额范围（万元）")
        @RequestParam(required = false) maxAmount: BigDecimal?,
    ): InvestmentOverview {
        val year = SettingsUtils["current_year"]?.toIntOrNull() ?: LocalDate.now().year
        val month = SettingsUtils["current_year.fagai_month"]?.toIntOrNull() ?: LocalDate.now().monthValue
        val monthStartDate = LocalDate.of(year, month, 1)
        val monthEndDate = monthStartDate.plusMonths(1).minusDays(1)
        val yearStartDate = LocalDate.of(year, 1, 1)
        val yearEndDate = LocalDate.of(year, 12, 31)
        val underConstruction = fagaiProjectService.getInvestmentOverviewUnderConstruction(
            monthStartDate, monthEndDate,
            yearStartDate, yearEndDate,
            minAmount, maxAmount,
        )
        val statisticalInvestment = fagaiProjectService.getInvestmentOverviewStatisticalInvestment(
            monthStartDate, monthEndDate,
            yearStartDate, yearEndDate,
            minAmount, maxAmount,
        )
        val investmentCompletion = fagaiProjectService.getInvestmentOverviewInvestmentCompletion(
            monthStartDate, monthEndDate,
            yearStartDate, yearEndDate,
            minAmount, maxAmount,
        )
        val industrialChainDistribution = fagaiProjectService.getInvestmentOverviewIndustrialChainDistribution(
            monthStartDate, monthEndDate,
            yearStartDate, yearEndDate,
            minAmount, maxAmount,
        )
        return InvestmentOverview(
            underConstruction,
            statisticalInvestment,
            investmentCompletion,
            industrialChainDistribution,
        )
    }

    @Operation(summary = "投资进度/在建项目")
    @GetMapping("under-construction")
    fun getUnderConstructionProjects(
        @Schema(description = "开始日期")
        @RequestParam(required = false) start: LocalDate?,
        @Schema(description = "结束日期")
        @RequestParam(required = false) end: LocalDate?,
        @Schema(description = "所属产业")
        @RequestParam(defaultValue = "") innovativeClusters: String,
        @Schema(description = "金额范围min")
        @RequestParam(required = false) minAmount: Double?,
        @Schema(description = "金额范围max")
        @RequestParam(required = false) maxAmount: Double?,
    ): UnderConstructionProjectsTreeVO {
        val year = end?.year ?: LocalDate.now().year
        val yearStartTime = LocalDate.of(year, 1, 1)
        val yearEndTime = LocalDate.of(year, 12, 31)
        val increasementList = fagaiProjectService.statisticKeyProjects(
            start, end, minAmount, maxAmount, innovativeClusters,
            isOut = null, isUnderConstruction = true,
        )
            .associateBy { it.district to it.park }
        val accumulationList = fagaiProjectService.statisticKeyProjects(
            yearStartTime, yearEndTime, minAmount, maxAmount, innovativeClusters,
            isOut = null, isUnderConstruction = true,
        )
            .associateBy { it.district to it.park }
        val domesticList = fagaiProjectService.statisticKeyProjects(
            yearStartTime, yearEndTime, minAmount, maxAmount, innovativeClusters,
            isOut = false, isUnderConstruction = true,
        )
            .associateBy { it.district to it.park }
        val foreignList = fagaiProjectService.statisticKeyProjects(
            yearStartTime, yearEndTime, minAmount, maxAmount, innovativeClusters,
            isOut = true, isUnderConstruction = true,
        )
            .associateBy { it.district to it.park }
        val data = increasementList.keys
            .union(accumulationList.keys)
            .union(domesticList.keys)
            .union(foreignList.keys)
            .map { key ->
                val (district, park) = key
                val increasement = increasementList[key]
                val accumulation = accumulationList[key]
                val domestic = domesticList[key]
                val foreign = foreignList[key]
                district to UnderConstructionProjectsTreeVO(
                    "", park,
                    increasement ?: KeyProjectsItem(district, park),
                    accumulation ?: KeyProjectsItem(district, park),
                    domestic ?: KeyProjectsItem(district, park),
                    foreign ?: KeyProjectsItem(district, park),
                )
            }
            .groupBy { it.first }
            .map { (district, list) -> district to list.map { it.second } }
            .associate { it }
        val list = AreaConstant.DISTRICT_LIST.map { (district, _) ->
            val list = data[district] ?: emptyList()
            makeTree(district, list)
        }
        return makeTree(AreaConstant.TAIZHOU_CODE, list)
    }

    private fun makeTree(
        district: String,
        list: List<UnderConstructionProjectsTreeVO>,
    ) = UnderConstructionProjectsTreeVO(
        district, "",
        KeyProjectsItem(list.map { it.increasement }),
        KeyProjectsItem(list.map { it.accumulation }),
        KeyProjectsItem(list.map { it.domestic }),
        KeyProjectsItem(list.map { it.foreign }),
        list.takeIf { it.size > 1 } ?: emptyList(),
    )

    @Operation(summary = "投资进度/入库投资")
    @GetMapping("statistical-investment")
    fun getStatisticalInvestment(
        @Schema(description = "开始日期")
        @RequestParam(required = false) start: LocalDate?,
        @Schema(description = "结束日期")
        @RequestParam(required = false) end: LocalDate?,
        @Schema(description = "所属产业")
        @RequestParam(defaultValue = "") innovativeClusters: String,
        @Schema(description = "金额范围min")
        @RequestParam(required = false) minAmount: Double?,
        @Schema(description = "金额范围max")
        @RequestParam(required = false) maxAmount: Double?,
    ): StatisticalInvestmentTreeVO {
        val monthStartTime = start
        val monthEndTime = end
        val year = end?.year ?: LocalDate.now().year
        val yearStartTime = LocalDate.of(year, 1, 1)
        val yearEndTime = LocalDate.of(year, 12, 31)
        val totalDataList = fagaiProjectService.getStatisticalProjectInfo(
            null, null,
            minAmount, maxAmount, innovativeClusters,
        )
            .associateBy { it.district to it.park }
        val staticalInvestmentDataList = fagaiProjectService.getStatisticalInvestment(
            monthStartTime, monthEndTime,
            minAmount, maxAmount, innovativeClusters,
        )
        val monthIncreasementList = fagaiProjectService.getStatisticalInfoIncreasement(
            monthStartTime, monthEndTime,
            minAmount, maxAmount, innovativeClusters,
        )
        val yearIncreasementList = fagaiProjectService.getStatisticalInfoIncreasement(
            yearStartTime, yearEndTime,
            minAmount, maxAmount, innovativeClusters,
        )
        val yearInvestmentList = fagaiProjectService.getStatisticalPlannedTotalInvestment(
            yearStartTime, yearEndTime,
            minAmount, maxAmount, innovativeClusters,
        )
        val data = totalDataList.keys
            .union(staticalInvestmentDataList.keys)
            .union(monthIncreasementList.keys)
            .union(yearIncreasementList.keys)
            .union(yearInvestmentList.keys)
            .map { key ->
                val (district, park) = key
                val totalData = totalDataList[key]
                val staticalInvestmentData = staticalInvestmentDataList[key]
                val monthIncreasement = monthIncreasementList[key] ?: 0
                val yearIncreasement = yearIncreasementList[key] ?: 0
                val yearInvestment = yearInvestmentList[key] ?: .0
                district to StatisticalInvestmentTreeVO(
                    "", park,
                    totalData?.count ?: 0,
                    totalData?.amount ?: .0,
                    staticalInvestmentData?.actualMonthInvestment ?: .0,
                    staticalInvestmentData?.actualYearInvestment ?: .0,
                    staticalInvestmentData?.actualTotalInvestment ?: .0,
                    monthIncreasement,
                    yearIncreasement,
                    yearInvestment,
                )
            }
            .groupBy { it.first }
            .map { (district, list) -> district to list.map { it.second } }
            .associate { it }
        val list = AreaConstant.DISTRICT_LIST.map { (district, _) ->
            val list = data[district] ?: emptyList()
            makeTree(district, list)
        }
        return makeTree(AreaConstant.TAIZHOU_CODE, list)
    }

    private fun makeTree(
        district: String,
        list: List<StatisticalInvestmentTreeVO>,
    ) = StatisticalInvestmentTreeVO(
        district, "",
        list.sumOf { it.totalCount },
        list.sumOf { it.totalInvestment },
        list.sumOf { it.monthStatisticalInvestment },
        list.sumOf { it.yearStatisticalInvestment },
        list.sumOf { it.totalStatisticalInvestment },
        list.sumOf { it.monthIncreasement },
        list.sumOf { it.yearIncreasement },
        list.sumOf { it.yearInvestment },
        list.takeIf { it.size > 1 } ?: emptyList(),
    )

    @Operation(summary = "投资进度/投资完成率")
    @GetMapping("investment-completion-rate")
    fun getInvestmentCompletionRate(
        @Schema(description = "开始日期")
        @RequestParam(required = false) start: LocalDate?,
        @Schema(description = "结束日期")
        @RequestParam(required = false) end: LocalDate?,
        @Schema(description = "所属产业")
        @RequestParam(defaultValue = "") innovativeClusters: String,
        @Schema(description = "金额范围min")
        @RequestParam(required = false) minAmount: Double?,
        @Schema(description = "金额范围max")
        @RequestParam(required = false) maxAmount: Double?,
    ): InvestmentCompletionRateTreeVO {
        val monthStartTime = start
        val monthEndTime = end
        val year = end?.year ?: LocalDate.now().year
        val yearStartTime = LocalDate.of(year, 1, 1)
        val yearEndTime = LocalDate.of(year, 12, 31)
        val monthDataList = fagaiProjectService.statisticKeyProjectsInvestment(
            monthStartTime, monthEndTime,
            minAmount, maxAmount,
            innovativeClusters, null,
        )
            .associateBy { it.district to it.park }
        val yearDataList = fagaiProjectService.statisticKeyProjectsInvestment(
            yearStartTime, yearEndTime,
            minAmount, maxAmount,
            innovativeClusters, null,
        )
            .associateBy { it.district to it.park }
        val l1 = fagaiProjectService.statisticKeyProjectsInvestment(
            yearStartTime, yearEndTime,
            minAmount, maxAmount,
            innovativeClusters, true
        )
            .associateBy { it.district to it.park }
        val l2 = fagaiProjectService.statisticKeyProjectsInvestment(
            yearStartTime, yearEndTime,
            minAmount, maxAmount,
            innovativeClusters, null,
        )
            .associateBy { it.district to it.park }
        val yearStatisticalInvestmentList = fagaiProjectService.statisticKeyProjectsStatisticalInvestment(
            yearStartTime, yearEndTime,
            minAmount, maxAmount, innovativeClusters,
        )
            .associateBy { it.district to it.park }
        val data = yearStatisticalInvestmentList.keys
            .union(monthDataList.keys)
            .union(yearDataList.keys)
            .union(l1.keys)
            .union(l2.keys)
            .map { key ->
                val (district, park) = key
                val monthData = monthDataList[key] ?: KeyProjectsItem(district, park)
                val yearData = yearDataList[key] ?: KeyProjectsItem(district, park)
                val yearStatisticalInvestment = yearStatisticalInvestmentList[key] ?: KeyProjectsItem(district, park)
                val r1 = l1[key]
                val r2 = l2[key]
                district to InvestmentCompletionRateTreeVO(
                    "", park,
                    monthData,
                    yearData,
                    yearStatisticalInvestment,
                    r1?.count ?: 0, r2?.count ?: 0,
                    r1?.amount ?: .0, r2?.amount ?: .0,
                )
            }
            .groupBy { it.first }
            .map { (district, list) -> district to list.map { it.second } }
            .associate { it }
        val list = AreaConstant.DISTRICT_LIST.map { (district, _) ->
            val list = data[district] ?: emptyList()
            makeTree(district, list)
        }
        return makeTree(AreaConstant.TAIZHOU_CODE, list)
    }

    private fun makeTree(
        district: String,
        list: List<InvestmentCompletionRateTreeVO>,
    ) = InvestmentCompletionRateTreeVO(
        district, "",
        KeyProjectsItem(list.map { it.month }),
        KeyProjectsItem(list.map { it.year }),
        KeyProjectsItem(list.map { it.statisticalInvestment }),
        list.sumOf { it.statisticalCount },
        list.sumOf { it.statisticalCountTotal },
        list.sumOf { it.statisticalAmount },
        list.sumOf { it.statisticalAmountTotal },
        list.takeIf { it.size > 1 } ?: emptyList(),
    )

    @Operation(summary = "投资进度/链群体系分布")
    @GetMapping("industrial-chain-distribution")
    fun getIndustrialChainDistribution(
        @Schema(description = "开始日期")
        @RequestParam(required = false) start: LocalDate?,
        @Schema(description = "结束日期")
        @RequestParam(required = false) end: LocalDate?,
        @Schema(description = "金额范围min")
        @RequestParam(required = false) minAmount: Double?,
        @Schema(description = "金额范围max")
        @RequestParam(required = false) maxAmount: Double?,
        @Schema(description = "项目类型: 1=开工 2=竣工")
        @RequestParam projectType: Int?,
    ): IndustrialChainDistributionTreeVO {
        val monthStartTime = start
        val monthEndTime = end
        val records = fagaiProjectService.statisticKeyProjectsForIndustrialChain(
            monthStartTime, monthEndTime,
            minAmount, maxAmount,
            projectType,
        )
        val projectCountTotal = records.sumOf { it.count }
        val projectAmountTotal = records.sumOf { it.amount }
        val dataList = records.map {
            it.innovativeCluster to IndustrialChainDistributionTreeVO(
                innovativeCluster = "",
                industrialChain = it.industrialChain,
                projectCount = it.count,
                projectCountTotal = projectCountTotal,
                investmentAmount = it.amount,
                investmentAmountTotal = projectAmountTotal,
            )
        }
            .groupBy { it.first }
            .map { (innovativeCluster, list) -> innovativeCluster to list.map { it.second } }
            .associate { it }
        val list = dataList.keys.map { innovativeCluster ->
            val list = dataList[innovativeCluster] ?: emptyList()
            makeTree(innovativeCluster, projectCountTotal, projectAmountTotal, list)
        }
        return makeTree("项目总数", projectCountTotal, projectAmountTotal, list)
    }

    private fun makeTree(
        innovativeCluster: String,
        projectCountTotal: Int,
        projectAmountTotal: Double,
        list: List<IndustrialChainDistributionTreeVO>,
    ) = IndustrialChainDistributionTreeVO(
        innovativeCluster, "",
        list.sumOf { it.projectCount },
        projectCountTotal,
        list.sumOf { it.investmentAmount },
        projectAmountTotal,
        list,
    )
}
