package com.tzdig.framework.controller.fagai

import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.db.queryRow
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.core.constant.AreaConstant
import com.tzdig.framework.core.constant.AreaConstant.DISTRICT_LIST
import com.tzdig.framework.model.vo.fagai.*
import com.tzdig.framework.mybatis.entity.prime.ProjectFilingInfo
import com.tzdig.framework.service.FagaiProjectService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.time.LocalDate

@Tag(name = "发改-备案审批")
@RestController
@RequestMapping("fagai/filing")
class FagaiFilingController(
    private val fagaiProjectService: FagaiProjectService,
) {
    @Operation(summary = "备案审批")
    @GetMapping("overview")
    fun getFilingOverview(
        @Schema(description = "年份")
        @RequestParam year: Int,
        @Schema(description = "月份")
        @RequestParam month: Int,
        @Schema(description = "是否为亿元以上项目")
        @RequestParam isOverOneBillion: Boolean?,
        @Schema(description = "是否为五亿元以上项目")
        @RequestParam isOverFiveBillion: Boolean?,
        @Schema(description = "是否为十亿以上项目")
        @RequestParam isOverTenBillion: Boolean?,
    ): filingStatVO {
        var minAmount: Double? = null
        var maxAmount: Double? = null
        if (isOverOneBillion == true) {
            minAmount = 10000.0
            maxAmount = 50000.0
        }
        if (isOverFiveBillion == true) {
            minAmount = 50000.0
            maxAmount = 100000.0
        }
        if (isOverTenBillion == true) {
            minAmount = 100000.0
        }
        val monthStartTime = LocalDate.of(year, month, 1)
        val monthEndTime = monthStartTime.plusMonths(1).minusDays(1)
        val yearStartTime = LocalDate.of(year, 1, 1)
        val yearEndTime = LocalDate.of(year, 12, 31)
        val month = queryCount<ProjectFilingInfo> {
            if (monthStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge monthStartTime)
            if (monthEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le monthEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val year = queryCount<ProjectFilingInfo> {
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val total = queryRow {
            select(QueryMethods.sum(ProjectFilingInfo::investmentAmount).`as`("value"))
            from(ProjectFilingInfo::class.java)
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }!!.getDouble("value")
        val needAddLand = queryCount<ProjectFilingInfo> {
            and(ProjectFilingInfo::landUseType eq "新增用地")
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val land = queryCount<ProjectFilingInfo> {
            and(ProjectFilingInfo::landUseType eq "新增用地")
            and(ProjectFilingInfo::landSupplyProgress like "土地摘牌")
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val noNeedAddLand = queryCount<ProjectFilingInfo> {
            and(ProjectFilingInfo::landUseType ne "新增用地")
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val environment = queryCount<ProjectFilingInfo> {
            and(ProjectFilingInfo::environmentalAssessmentStatus like "完成")
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val energy = queryCount<ProjectFilingInfo> {
            and(ProjectFilingInfo::energyAssessmentStatus like "已完成")
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val security = queryCount<ProjectFilingInfo> {
            and(ProjectFilingInfo::safetyAssessmentStatus like "已完成")
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val map = queryCount<ProjectFilingInfo> {
            and(ProjectFilingInfo::constructionDrawingReviewStatus like "已完成")
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val construction = queryCount<ProjectFilingInfo> {
            and(ProjectFilingInfo::constructionPermitStatus like "已")
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val industry = queryCount<ProjectFilingInfo> {
            and(ProjectFilingInfo::projectType eq "工业")
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val total2 = queryRow {
            select(QueryMethods.sum(ProjectFilingInfo::investmentAmount).`as`("value"))
            and(ProjectFilingInfo::projectType eq "工业")
            from(ProjectFilingInfo::class.java)
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }!!.getDouble("value")
        val keyIndustry = queryCount<ProjectFilingInfo> {
            and(ProjectFilingInfo::industrialChain.isNotNull)
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }
        val total3 = queryRow {
            select(QueryMethods.sum(ProjectFilingInfo::investmentAmount).`as`("value"))
            and(ProjectFilingInfo::industrialChain.isNotNull)
            from(ProjectFilingInfo::class.java)
            if (yearStartTime != null)
                and(ProjectFilingInfo::completeFilingTime ge yearStartTime)
            if (yearEndTime != null)
                and(ProjectFilingInfo::completeFilingTime le yearEndTime)
            if (minAmount != null)
                and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
            if (maxAmount != null)
                and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        }!!.getDouble("value")
        return filingStatVO(
            month = month,
            year = year,
            total = total,
            needAddLand = needAddLand,
            land = land,
            noNeedAddLand = noNeedAddLand,
            environment = environment,
            energy = energy,
            security = security,
            map = map,
            construction = construction,
            industry = industry,
            total2 = total2,
            keyIndustry = keyIndustry,
            total3 = total3,
        )
    }

    @Operation(summary = "备案审批/新备案项目")
    @GetMapping("filing-projects")
    fun getFilingProjects(
        @Schema(description = "开始日期")
        @RequestParam(required = false) start: LocalDate?,
        @Schema(description = "结束日期")
        @RequestParam(required = false) end: LocalDate?,
        @Schema(description = "所属行业1：工业、2：服务业")
        @RequestParam projectType: String?,
        @Schema(description = "金额范围min")
        @RequestParam(required = false) minAmount: Double?,
        @Schema(description = "金额范围max")
        @RequestParam(required = false) maxAmount: Double?,
    ): FilingProjectStateTreeVO {
        val year = end?.year ?: LocalDate.now().year
        val yearStartTime = LocalDate.of(year, 1, 1)
        val yearEndTime = LocalDate.of(year, 12, 31)
        val type = when (projectType) {
            "1" -> {
                "工业"
            }

            "2" -> {
                "服务业"
            }

            else -> null
        }
        val increasementList = fagaiProjectService.filingProjects(
            start, end, minAmount, maxAmount,
            type, null,
        )
            .associateBy { it.district to it.park }
        val accumulationList = fagaiProjectService.filingProjects(
            yearStartTime, yearEndTime, minAmount, maxAmount,
            type, null,
        )
            .associateBy { it.district to it.park }
        val domesticList = fagaiProjectService.filingProjects(
            yearStartTime, yearEndTime, minAmount, maxAmount,
            type, false,
        )
            .associateBy { it.district to it.park }
        val foreignList = fagaiProjectService.filingProjects(
            yearStartTime, yearEndTime, minAmount, maxAmount,
            type, true
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
                FilingProjectStateTreeVO(
                    district, park,
                    increasement ?: KeyProjectsItem(district, park),
                    accumulation ?: KeyProjectsItem(district, park),
                    domestic ?: KeyProjectsItem(district, park),
                    foreign ?: KeyProjectsItem(district, park),
                )
            }
            .groupBy { it.district }
        val list = DISTRICT_LIST.map { (_, district) ->
            val list = data[district] ?: emptyList()
            makeTree(district, list)
        }
        return makeTree(AreaConstant.TAIZHOU_NAME, list)
    }

    private fun makeTree(
        district: String,
        list: List<FilingProjectStateTreeVO>,
    ) = FilingProjectStateTreeVO(
        district, "",
        KeyProjectsItem(list.map { it.increasement }),
        KeyProjectsItem(list.map { it.accumulation }),
        KeyProjectsItem(list.map { it.domestic }),
        KeyProjectsItem(list.map { it.foreign }),
        list.takeIf { it.size > 1 } ?: emptyList(),
    )

    @Operation(summary = "备案审批/用地保障")
    @GetMapping("land-use")
    fun getLandUse(
        @Schema(description = "开始日期")
        @RequestParam(required = false) start: LocalDate?,
        @Schema(description = "结束日期")
        @RequestParam(required = false) end: LocalDate?,
        @Schema(description = "所属行业1：工业、2：服务业")
        @RequestParam projectType: String?,
        @Schema(description = "金额范围min")
        @RequestParam(required = false) minAmount: Double?,
        @Schema(description = "金额范围max")
        @RequestParam(required = false) maxAmount: Double?,
    ): UseLandStateTreeVO {
        val year = LocalDate.now().year
        var startTime = LocalDate.of(year, 1, 1)
        var endTime = LocalDate.of(year, 12, 31)
        if (start != null || end != null) {
            startTime = start
            endTime = end
        }
        val type = when (projectType) {
            "1" -> {
                "工业"
            }

            "2" -> {
                "服务业"
            }

            else -> null
        }

        val allList = fagaiProjectService.useLandState(
            startTime, endTime, minAmount, maxAmount,
            type, null, null, null
        ).associateBy { it.district to it.park }
        val increasementList = fagaiProjectService.useLandState(
            startTime, endTime, minAmount, maxAmount,
            type, true, null, null
        )
            .associateBy { it.district to it.park }
        val accumulationList = fagaiProjectService.useLandState(
            startTime, endTime, minAmount, maxAmount,
            type, true, null, true
        )
            .associateBy { it.district to it.park }
        val nonLandProjectList = fagaiProjectService.useLandState(
            startTime, endTime, minAmount, maxAmount,
            type, false, null, null
        )
            .associateBy { it.district to it.park }
        val factoryProjectList = fagaiProjectService.useLandState(
            startTime, endTime, minAmount, maxAmount,
            type, false, isFactory = true, isLand = null
        )
            .associateBy { it.district to it.park }
        val data = increasementList.keys
            .union(allList.keys)
            .union(accumulationList.keys)
            .union(nonLandProjectList.keys)
            .union(factoryProjectList.keys)
            .map { key ->
                val (district, park) = key
                val total = allList[key]
                val increasement = increasementList[key]
                val accumulation = accumulationList[key]
                val nonLandProject = nonLandProjectList[key]
                val factoryProject = factoryProjectList[key]
                UseLandStateTreeVO(
                    district, park,
                    total ?: KeyProjectsItem(district, park),
                    increasement ?: KeyProjectsItem(district, park),
                    accumulation ?: KeyProjectsItem(district, park),
                    nonLandProject ?: KeyProjectsItem(district, park),
                    factoryProject ?: KeyProjectsItem(district, park),
                )
            }
            .groupBy { it.district }
        val list = DISTRICT_LIST.map { (_, district) ->
            val list = data[district] ?: emptyList()
            makeTree(district, list)
        }
        return makeTree(AreaConstant.TAIZHOU_NAME, list)
    }

    private fun makeTree(
        district: String,
        list: List<UseLandStateTreeVO>,
    ) = UseLandStateTreeVO(
        district, "",
        KeyProjectsItem(list.map { it.total }),
        KeyProjectsItem(list.map { it.increasement }),
        KeyProjectsItem(list.map { it.accumulation }),
        KeyProjectsItem(list.map { it.nonLandProject }),
        KeyProjectsItem(list.map { it.factoryProject }),
        list.takeIf { it.size > 1 } ?: emptyList(),
    )

    @Operation(summary = "备案审批/链群体系分布")
    @GetMapping("industrial-chain-distribution-1")
    fun getIndustrialChainDistribution1(
        @Schema(description = "开始日期")
        @RequestParam(required = false) start: LocalDate?,
        @Schema(description = "结束日期")
        @RequestParam(required = false) end: LocalDate?,
        @Schema(description = "金额范围min")
        @RequestParam(required = false) minAmount: Double?,
        @Schema(description = "金额范围max")
        @RequestParam(required = false) maxAmount: Double?,
    ): IndustrialChainDistributionTreeVO {
        val year = LocalDate.now().year
        var startTime = LocalDate.of(year, 1, 1)
        var endTime = LocalDate.of(year, 12, 31)
        if (start != null || end != null) {
            startTime = start
            endTime = end
        }
        val records = fagaiProjectService.statisticFilingProjectsForIndustrialChain(
            startTime, endTime,
            minAmount, maxAmount,
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
        innovativeCluster,
        "",
        list.sumOf { it.projectCount },
        projectCountTotal,
        list.sumOf { it.investmentAmount },
        projectAmountTotal,
        list,
    )

    //审批服务
    @Operation(summary = "备案审批/审批服务")
    @GetMapping("review-service")
    fun getReviewService(
        @Schema(description = "开始日期")
        @RequestParam(required = false) start: LocalDate?,
        @Schema(description = "结束日期")
        @RequestParam(required = false) end: LocalDate?,
        @Schema(description = "所属行业1：工业、2：服务业")
        @RequestParam projectType: String?,
        @Schema(description = "金额范围min")
        @RequestParam(required = false) minAmount: Double?,
        @Schema(description = "金额范围max")
        @RequestParam(required = false) maxAmount: Double?,
    ): FilingProjectReviewStateTreeVO {
        val year = LocalDate.now().year
        var startTime = LocalDate.of(year, 1, 1)
        var endTime = LocalDate.of(year, 12, 31)
        if (start != null || end != null) {
            startTime = start
            endTime = end
        }
        val type = when (projectType) {
            "1" -> {
                "工业"
            }

            "2" -> {
                "服务业"
            }

            else -> null
        }
        val allList = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            0, null, type
        ).associateBy { it.district to it.park }
        val list1 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            1, true, type
        ).associateBy { it.district to it.park }
        val list2 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            1, false, type
        ).associateBy { it.district to it.park }
        val list3 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            2, true, type
        ).associateBy { it.district to it.park }
        val list4 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            2, false, type
        ).associateBy { it.district to it.park }
        val list5 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            3, true, type
        ).associateBy { it.district to it.park }
        val list6 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            3, false, type
        ).associateBy { it.district to it.park }
        val list7 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            4, true, type
        ).associateBy { it.district to it.park }
        val list8 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            4, false, type
        ).associateBy { it.district to it.park }
        val list9 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            5, true, type
        ).associateBy { it.district to it.park }
        val list10 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            5, false, type
        ).associateBy { it.district to it.park }
        val list11 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            6, true, type
        ).associateBy { it.district to it.park }
        val list12 = fagaiProjectService.reviewState(
            startTime, endTime,
            minAmount, maxAmount,
            6, false, type
        ).associateBy { it.district to it.park }
        val data = allList.keys
            .union(list1.keys)
            .union(list2.keys)
            .union(list3.keys)
            .union(list4.keys)
            .union(list5.keys)
            .union(list6.keys)
            .union(list7.keys)
            .union(list8.keys)
            .union(list9.keys)
            .union(list10.keys)
            .union(list11.keys)
            .union(list12.keys)
            .map { key ->
                val (district, park) = key
                val all = allList[key]
                val list1 = list1[key]
                val list2 = list2[key]
                val list3 = list3[key]
                val list4 = list4[key]
                val list5 = list5[key]
                val list6 = list6[key]
                val list7 = list7[key]
                val list8 = list8[key]
                val list9 = list9[key]
                val list10 = list10[key]
                val list11 = list11[key]
                val list12 = list12[key]
                FilingProjectReviewStateTreeVO(
                    district, park,
                    all ?: FilingProjectItem(district, park),
                    list1 ?: FilingProjectItem(district, park),
                    list2 ?: FilingProjectItem(district, park),
                    list3 ?: FilingProjectItem(district, park),
                    list4 ?: FilingProjectItem(district, park),
                    list5 ?: FilingProjectItem(district, park),
                    list6 ?: FilingProjectItem(district, park),
                    list7 ?: FilingProjectItem(district, park),
                    list8 ?: FilingProjectItem(district, park),
                    list9 ?: FilingProjectItem(district, park),
                    list10 ?: FilingProjectItem(district, park),
                    list11 ?: FilingProjectItem(district, park),
                    list12 ?: FilingProjectItem(district, park),
                )
            }.groupBy { it.district }

        val list = DISTRICT_LIST.map { (_, district) ->
            val list = data[district] ?: emptyList()
            makeTree(district, list)
        }
        return makeTree(AreaConstant.TAIZHOU_NAME, list)
    }

    private fun makeTree(
        district: String,
        list: List<FilingProjectReviewStateTreeVO>,
    ) = FilingProjectReviewStateTreeVO(
        district, "",
        FilingProjectItem(list.map { it.count }),
        FilingProjectItem(list.map { it.environment }),
        FilingProjectItem(list.map { it.nonEnvironment }),
        FilingProjectItem(list.map { it.energy }),
        FilingProjectItem(list.map { it.nonEnergy }),
        FilingProjectItem(list.map { it.security }),
        FilingProjectItem(list.map { it.nonSecurity }),
        FilingProjectItem(list.map { it.map }),
        FilingProjectItem(list.map { it.nonMap }),
        FilingProjectItem(list.map { it.construction }),
        FilingProjectItem(list.map { it.nonConstruction }),
        FilingProjectItem(list.map { it.planning }),
        FilingProjectItem(list.map { it.nonPlanning }),
        list.takeIf { it.size > 1 } ?: emptyList(),
    )
}
