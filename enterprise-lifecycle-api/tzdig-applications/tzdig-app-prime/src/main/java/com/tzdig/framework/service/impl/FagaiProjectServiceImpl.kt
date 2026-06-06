package com.tzdig.framework.service.impl

import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.db.queryRow
import com.mybatisflex.kotlin.extensions.db.queryRows
import com.mybatisflex.kotlin.extensions.kproperty.*
import com.tzdig.framework.model.vo.fagai.FilingProjectItem
import com.tzdig.framework.model.vo.fagai.InvestmentOverview
import com.tzdig.framework.model.vo.fagai.KeyProjectsItem
import com.tzdig.framework.mybatis.bo.ProjectFagaiKeyProjectsStatsVO
import com.tzdig.framework.mybatis.dao.FagaiStatDAO
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiKeyProjects
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiStaticalInfo
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiStaticalInvestment
import com.tzdig.framework.mybatis.entity.prime.ProjectFilingInfo
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.service.FagaiProjectService
import com.tzdig.framework.service.InvestOnlineService
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class FagaiProjectServiceImpl(
    private val dao: FagaiStatDAO,
    private val investOnlineService: InvestOnlineService,
) : FagaiProjectService {
    //项目类型type(市级重点1、1亿元2、10亿元3、全部4)
    override fun getAllFagaiState(
        status: Int,
        type: Int,
        date: String?,
        industry: String?,
    ): List<ProjectFagaiKeyProjectsStatsVO> {
        val columnName = when (type) {
            1 -> "is_municipal_key"
            2 -> "is_over_one_billion"
            3 -> "is_over_ten_billion"
            else -> null
        }
        return when (status) {
            1 -> dao.getStartState(columnName, date, industry)
            2 -> dao.getCompletionState(columnName, date, industry)
            3 -> dao.getOnBuildingState(columnName, date, industry)
            else -> emptyList()
        }
    }

    override fun getInvestmentOverviewUnderConstruction(
        monthStartDate: LocalDate,
        monthEndDate: LocalDate,
        yearStartDate: LocalDate,
        yearEndDate: LocalDate,
        minAmount: BigDecimal?,
        maxAmount: BigDecimal?,
    ): InvestmentOverview.UnderConstruction {
        val monthIncreasement = queryCount<ProjectFagaiKeyProjects> {
            and(ProjectFagaiKeyProjects::projectType eq 1)
            and(ProjectFagaiKeyProjects::isUnderConstruction eq true)
            and(ProjectFagaiKeyProjects::startDate between monthStartDate..monthEndDate)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }
        val yearIncreasement = queryCount<ProjectFagaiKeyProjects> {
            and(ProjectFagaiKeyProjects::projectType eq 1)
            and(ProjectFagaiKeyProjects::isUnderConstruction eq true)
            and(ProjectFagaiKeyProjects::startDate between yearStartDate..yearEndDate)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }
        val plannedTotalInvestment = queryRow {
            select(
                QueryMethods.sum(ProjectFagaiKeyProjects::plannedTotalInvestmentAll)
                    .`as`("value")
            )
            from(ProjectFagaiKeyProjects::class.java)
            and(ProjectFagaiKeyProjects::projectType eq 1)
            and(ProjectFagaiKeyProjects::isUnderConstruction eq true)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }?.getDouble("value") ?: .0
        return InvestmentOverview.UnderConstruction(
            monthIncreasement = monthIncreasement,
            yearIncreasement = yearIncreasement,
            plannedTotalInvestment = plannedTotalInvestment,
        )
    }

    override fun getInvestmentOverviewStatisticalInvestment(
        monthStartDate: LocalDate,
        monthEndDate: LocalDate,
        yearStartDate: LocalDate,
        yearEndDate: LocalDate,
        minAmount: BigDecimal?,
        maxAmount: BigDecimal?,
    ): InvestmentOverview.StatisticalInvestment {
        val projectNameList = query<ProjectFagaiKeyProjects> {
            select(ProjectFagaiKeyProjects::statisticalProjectName)
            where(ProjectFagaiKeyProjects::statisticalProjectName.isNotNull)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }.mapNotNull { it.statisticalProjectName }
        if (projectNameList.isEmpty()) {
            return InvestmentOverview.StatisticalInvestment(
                monthCount = 0,
                monthAmount = .0,
                yearCount = 0,
                yearAmount = .0,
            )
        }
        val monthCount = queryCount<ProjectFagaiStaticalInfo> {
            and(ProjectFagaiStaticalInfo::entryDate between monthStartDate..monthEndDate)
            and(ProjectFagaiStaticalInfo::projectName inList projectNameList)
        }
        val yearCount = queryCount<ProjectFagaiStaticalInfo> {
            and(ProjectFagaiStaticalInfo::entryDate between yearStartDate..yearEndDate)
            and(ProjectFagaiStaticalInfo::projectName inList projectNameList)
        }
        val monthAmount = queryRow {
            select(
                QueryMethods.sum(ProjectFagaiStaticalInvestment::actualMonthInvestment)
                    .`as`("value")
            )
            from(ProjectFagaiStaticalInvestment::class.java)
            and(ProjectFagaiStaticalInvestment::yearAndMonth between monthStartDate..monthEndDate)
            and(ProjectFagaiStaticalInvestment::projectName inList projectNameList)
        }?.getDouble("value") ?: .0
        val yearAmount = queryRow {
            select(
                QueryMethods.sum(ProjectFagaiStaticalInvestment::actualYearInvestment)
                    .`as`("value")
            )
            from(ProjectFagaiStaticalInvestment::class.java)
            and(ProjectFagaiStaticalInvestment::yearAndMonth between monthStartDate..monthEndDate)
            and(ProjectFagaiStaticalInvestment::projectName inList projectNameList)
        }?.getDouble("value") ?: .0
        return InvestmentOverview.StatisticalInvestment(
            monthCount = monthCount,
            monthAmount = monthAmount,
            yearCount = yearCount,
            yearAmount = yearAmount,
        )
    }

    override fun getInvestmentOverviewInvestmentCompletion(
        monthStartDate: LocalDate,
        monthEndDate: LocalDate,
        yearStartDate: LocalDate,
        yearEndDate: LocalDate,
        minAmount: BigDecimal?,
        maxAmount: BigDecimal?,
    ): InvestmentOverview.InvestmentCompletion {
        val monthCompletion = queryCount<ProjectFagaiKeyProjects> {
            and(ProjectFagaiKeyProjects::projectType eq 2)
            and(ProjectFagaiKeyProjects::completionDate between monthStartDate..monthEndDate)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }
        val yearCompletion = queryCount<ProjectFagaiKeyProjects> {
            and(ProjectFagaiKeyProjects::projectType eq 2)
            and(ProjectFagaiKeyProjects::completionDate between yearStartDate..yearEndDate)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }
        val plannedTotalInvestment = queryRow {
            select(
                QueryMethods.sum(ProjectFagaiKeyProjects::plannedTotalInvestmentAll)
                    .`as`("value")
            )
            from(ProjectFagaiKeyProjects::class.java)
            and(ProjectFagaiKeyProjects::projectType eq 2)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }?.getDouble("value") ?: .0
        val actualTotalInvestment = queryRow {
            select(
                QueryMethods.sum(ProjectFagaiKeyProjects::actualTotalInvestmentAll)
                    .`as`("value")
            )
            from(ProjectFagaiKeyProjects::class.java)
            and(ProjectFagaiKeyProjects::projectType eq 2)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }?.getDouble("value") ?: .0
        return InvestmentOverview.InvestmentCompletion(
            monthCompletion = monthCompletion,
            yearCompletion = yearCompletion,
            plannedTotalInvestment = plannedTotalInvestment,
            actualTotalInvestment = actualTotalInvestment,
        )
    }

    override fun getInvestmentOverviewIndustrialChainDistribution(
        monthStartDate: LocalDate,
        monthEndDate: LocalDate,
        yearStartDate: LocalDate,
        yearEndDate: LocalDate,
        minAmount: BigDecimal?,
        maxAmount: BigDecimal?,
    ): InvestmentOverview.IndustrialChainDistribution {
        val industryProjectCount = queryCount<ProjectFagaiKeyProjects> {
            and(ProjectFagaiKeyProjects::projectType eq 1)
            and(ProjectFagaiKeyProjects::isUnderConstruction eq true)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }
        val industryProjectPlannedTotalInvestment = queryRow {
            select(
                QueryMethods.sum(ProjectFagaiKeyProjects::plannedTotalInvestmentDomestic)
                    .`as`("value")
            )
            from(ProjectFagaiKeyProjects::class.java)
            and(ProjectFagaiKeyProjects::projectType eq 1)
            and(ProjectFagaiKeyProjects::isUnderConstruction eq true)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }?.getDouble("value") ?: .0
        val industrialChainProjectCount = queryCount<ProjectFagaiKeyProjects> {
            and(ProjectFagaiKeyProjects::projectType eq 1)
            and(ProjectFagaiKeyProjects::isUnderConstruction eq true)
            and(ProjectFagaiKeyProjects::industrialChain.isNotNull)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }
        val industrialChainPlannedTotalInvestment = queryRow {
            select(
                QueryMethods.sum(ProjectFagaiKeyProjects::plannedTotalInvestmentDomestic)
                    .`as`("value")
            )
            from(ProjectFagaiKeyProjects::class.java)
            and(ProjectFagaiKeyProjects::projectType eq 1)
            and(ProjectFagaiKeyProjects::isUnderConstruction eq true)
            and(ProjectFagaiKeyProjects::industrialChain.isNotNull)
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(10000.00))
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(50000.00))
//            if (isMunicipalKey) and(ProjectFagaiKeyProjects::isMunicipalKey eq true)
//            if (isOverOneBillion) and(ProjectFagaiKeyProjects::isOverOneBillion eq true)
            if (minAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge minAmount)
            if (maxAmount != null) and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll le maxAmount)
        }?.getDouble("value") ?: .0
        return InvestmentOverview.IndustrialChainDistribution(
            industryProjectCount = industryProjectCount,
            industryProjectPlannedTotalInvestment = industryProjectPlannedTotalInvestment,
            industrialChainProjectCount = industrialChainProjectCount,
            industrialChainPlannedTotalInvestment = industrialChainPlannedTotalInvestment,
        )
    }

    override fun statisticKeyProjects(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
        isOut: Boolean?,
        isUnderConstruction: Boolean?,
    ) = query<KeyProjectsItem> {
        from(ProjectFagaiKeyProjects::class.java)
        select(ProjectFagaiKeyProjects::district, ProjectFagaiKeyProjects::park)
        groupBy(ProjectFagaiKeyProjects::district, ProjectFagaiKeyProjects::park)
        select(
            QueryMethods.count()
                .`as`(KeyProjectsItem::count.name),
            QueryMethods.sum(ProjectFagaiKeyProjects::plannedTotalInvestmentAll)
                .`as`(KeyProjectsItem::amount.name)
        )
        and(ProjectFagaiKeyProjects::projectType eq 1)
        if (startTime != null)
            and(ProjectFagaiKeyProjects::startDate ge startTime)
        if (endTime != null)
            and(ProjectFagaiKeyProjects::startDate le endTime)
        if (isUnderConstruction != null)
            and(ProjectFagaiKeyProjects::isUnderConstruction eq isUnderConstruction)
        if (minAmount != null)
            and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(minAmount))
        if (maxAmount != null)
            and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll lt BigDecimal.valueOf(maxAmount))
        if (industrialChain.isNotEmpty())
            and {
                it.or(ProjectFagaiKeyProjects::innovativeCluster like industrialChain)
                it.or(ProjectFagaiKeyProjects::industrialChain like industrialChain)
            }
        if (isOut != null)
            and(ProjectFagaiKeyProjects::isOut eq isOut)
    }

    override fun statisticKeyProjectsStatisticalInvestment(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
    ) = query<KeyProjectsItem> {
        from(ProjectFagaiKeyProjects::class.java)
        select(ProjectFagaiKeyProjects::district, ProjectFagaiKeyProjects::park)
        groupBy(ProjectFagaiKeyProjects::district, ProjectFagaiKeyProjects::park)
        select(
            QueryMethods.count()
                .`as`(KeyProjectsItem::count.name),
            QueryMethods.sum(ProjectFagaiKeyProjects::statisticalActualTotalInvestment)
                .`as`(KeyProjectsItem::amount.name),
        )
        and(ProjectFagaiKeyProjects::projectType eq 2)
        if (startTime != null)
            and(ProjectFagaiKeyProjects::completionDate ge startTime)
        if (endTime != null)
            and(ProjectFagaiKeyProjects::completionDate le endTime)
        if (minAmount != null)
            and(ProjectFagaiKeyProjects::actualTotalInvestmentAll ge BigDecimal.valueOf(minAmount))
        if (maxAmount != null)
            and(ProjectFagaiKeyProjects::actualTotalInvestmentAll lt BigDecimal.valueOf(maxAmount))
        if (industrialChain.isNotEmpty())
            and {
                it.or(ProjectFagaiKeyProjects::innovativeCluster like industrialChain)
                it.or(ProjectFagaiKeyProjects::industrialChain like industrialChain)
            }
    }

    override fun statisticKeyProjectsInvestment(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
        isStatistical: Boolean?,
    ) = query<KeyProjectsItem> {
        from(ProjectFagaiKeyProjects::class.java)
        select(ProjectFagaiKeyProjects::district, ProjectFagaiKeyProjects::park)
        groupBy(ProjectFagaiKeyProjects::district, ProjectFagaiKeyProjects::park)
        select(
            QueryMethods.count()
                .`as`(KeyProjectsItem::count.name),
            QueryMethods.sum(ProjectFagaiKeyProjects::actualTotalInvestmentAll)
                .`as`(KeyProjectsItem::amount.name)
        )
        and(ProjectFagaiKeyProjects::projectType eq 2)
        if (startTime != null)
            and(ProjectFagaiKeyProjects::completionDate ge startTime)
        if (endTime != null)
            and(ProjectFagaiKeyProjects::completionDate le endTime)
        if (minAmount != null)
            and(ProjectFagaiKeyProjects::actualTotalInvestmentAll ge BigDecimal.valueOf(minAmount))
        if (maxAmount != null)
            and(ProjectFagaiKeyProjects::actualTotalInvestmentAll lt BigDecimal.valueOf(maxAmount))
        if (industrialChain.isNotEmpty())
            and {
                it.or(ProjectFagaiKeyProjects::innovativeCluster like industrialChain)
                it.or(ProjectFagaiKeyProjects::industrialChain like industrialChain)
            }
        when (isStatistical) {
            true -> and(ProjectFagaiKeyProjects::statisticalProjectCode.isNotNull)
            false -> and(ProjectFagaiKeyProjects::statisticalProjectCode.isNull)
            null -> {}
        }
    }

    override fun statisticKeyProjectsForIndustrialChain(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        projectType: Int?,
    ) = query<KeyProjectsItem> {
        from(ProjectFagaiKeyProjects::class.java)
        select(ProjectFagaiKeyProjects::innovativeCluster, ProjectFagaiKeyProjects::industrialChain)
        groupBy(ProjectFagaiKeyProjects::innovativeCluster, ProjectFagaiKeyProjects::industrialChain)
        select(
            QueryMethods.count()
                .`as`(KeyProjectsItem::count.name),
            QueryMethods.sum(ProjectFagaiKeyProjects::plannedTotalInvestmentAll)
                .`as`(KeyProjectsItem::amount.name)
        )
        var countyCode = investOnlineService.getCountyCode()
        if (countyCode.isNotEmpty()) {
            and(ProjectFagaiKeyProjects::district inList countyCode)
        } else {
            countyCode = DataGrantsUtils.grantedAreas.toList()
            and(ProjectFagaiKeyProjects::park inList countyCode)
        }
        and(ProjectFagaiKeyProjects::projectType eq 1)
        and(ProjectFagaiKeyProjects::isUnderConstruction eq true)
        and(ProjectFagaiKeyProjects::innovativeCluster.isNotNull)
        if (startTime != null)
            and(ProjectFagaiKeyProjects::startDate ge startTime)
        if (endTime != null)
            and(ProjectFagaiKeyProjects::startDate le endTime)
        if (minAmount != null)
            and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll ge BigDecimal.valueOf(minAmount))
        if (maxAmount != null)
            and(ProjectFagaiKeyProjects::plannedTotalInvestmentAll lt BigDecimal.valueOf(maxAmount))
        if (projectType != null)
            and(ProjectFagaiKeyProjects::projectType eq projectType)
    }

    override fun getStatisticalProjectInfo(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
    ) = query<KeyProjectsItem> {
        from(ProjectFagaiStaticalInfo::class.java)
        leftJoin(ProjectFagaiStaticalInvestment::class.java).on {
            it.and(ProjectFagaiStaticalInvestment::projectName eq ProjectFagaiStaticalInfo::projectName)
            it.and(ProjectFagaiStaticalInvestment::onlineApprovalCode eq ProjectFagaiStaticalInfo::onlineApprovalCode)
        }
        select(ProjectFagaiStaticalInvestment::district)
        groupBy(ProjectFagaiKeyProjects::district.name)
        if (industrialChain.isNotEmpty()) {
            join(ProjectFagaiKeyProjects::class.java)
                .on(ProjectFagaiKeyProjects::statisticalProjectName eq ProjectFagaiStaticalInfo::projectName)
            and {
                it.or(ProjectFagaiKeyProjects::innovativeCluster like industrialChain)
                it.or(ProjectFagaiKeyProjects::industrialChain like industrialChain)
            }
        }
        select(
            QueryMethods.count()
                .`as`(KeyProjectsItem::count.name),
            QueryMethods.sum(ProjectFagaiStaticalInfo::plannedTotalInvestment)
                .`as`(KeyProjectsItem::amount.name)
        )
        if (startTime != null)
            and(ProjectFagaiStaticalInfo::entryDate ge startTime)
        if (endTime != null)
            and(ProjectFagaiStaticalInfo::entryDate le endTime)
        if (minAmount != null)
            and(ProjectFagaiStaticalInfo::plannedTotalInvestment ge minAmount)
        if (maxAmount != null)
            and(ProjectFagaiStaticalInfo::plannedTotalInvestment lt maxAmount)
    }

    override fun getStatisticalInvestment(
        monthStartTime: LocalDate?,
        monthEndTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
    ) = queryRows {
        from(ProjectFagaiStaticalInfo::class.java)
        leftJoin(ProjectFagaiStaticalInvestment::class.java).on {
            it.and(ProjectFagaiStaticalInvestment::projectName eq ProjectFagaiStaticalInfo::projectName)
            it.and(ProjectFagaiStaticalInvestment::onlineApprovalCode eq ProjectFagaiStaticalInfo::onlineApprovalCode)
        }
        select(ProjectFagaiStaticalInvestment::district)
        groupBy(ProjectFagaiKeyProjects::district.name)
        if (industrialChain.isNotEmpty()) {
            join(ProjectFagaiKeyProjects::class.java)
                .on(ProjectFagaiKeyProjects::statisticalProjectName eq ProjectFagaiStaticalInvestment::projectName)
            and {
                it.or(ProjectFagaiKeyProjects::innovativeCluster like industrialChain)
                it.or(ProjectFagaiKeyProjects::industrialChain like industrialChain)
            }
        }
        select(
            QueryMethods.sum(ProjectFagaiStaticalInvestment::actualTotalInvestment)
                .`as`("actualTotalInvestment"),
            QueryMethods.sum(ProjectFagaiStaticalInvestment::actualMonthInvestment)
                .`as`("actualTotalInvestmentMonth"),
            QueryMethods.sum(ProjectFagaiStaticalInvestment::actualYearInvestment)
                .`as`("actualTotalInvestmentYear"),
        )
        if (monthStartTime != null)
            and(ProjectFagaiStaticalInfo::entryDate ge monthStartTime)
        if (monthEndTime != null)
            and(ProjectFagaiStaticalInfo::entryDate le monthEndTime)
        if (minAmount != null)
            and(ProjectFagaiStaticalInfo::plannedTotalInvestment ge minAmount)
        if (maxAmount != null)
            and(ProjectFagaiStaticalInfo::plannedTotalInvestment lt maxAmount)
    }.associate { row ->
        val district = row.getString(ProjectFagaiKeyProjects::district.name, "")
        val park = row.getString(ProjectFagaiKeyProjects::park.name, "")
        val v = ProjectFagaiStaticalInvestment {
            actualTotalInvestment = row.getDouble("actualTotalInvestment")
            actualMonthInvestment = row.getDouble("actualTotalInvestmentMonth")
            actualYearInvestment = row.getDouble("actualTotalInvestmentYear")
        }
        district to park to v
    }

    override fun getStatisticalInfoIncreasement(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
    ) = queryRows {
        from(ProjectFagaiStaticalInfo::class.java)
        leftJoin(ProjectFagaiStaticalInvestment::class.java).on {
            it.and(ProjectFagaiStaticalInvestment::projectName eq ProjectFagaiStaticalInfo::projectName)
            it.and(ProjectFagaiStaticalInvestment::onlineApprovalCode eq ProjectFagaiStaticalInfo::onlineApprovalCode)
        }
        select(ProjectFagaiStaticalInvestment::district)
        groupBy(ProjectFagaiKeyProjects::district.name)
        if (industrialChain.isNotEmpty()) {
            join(ProjectFagaiKeyProjects::class.java)
                .on(ProjectFagaiKeyProjects::statisticalProjectName eq ProjectFagaiStaticalInfo::projectName)
            and {
                it.or(ProjectFagaiKeyProjects::innovativeCluster like industrialChain)
                it.or(ProjectFagaiKeyProjects::industrialChain like industrialChain)
            }
        }
        select(
            QueryMethods.count()
                .`as`("value"),
        )
        if (startTime != null)
            and(ProjectFagaiStaticalInfo::entryDate ge startTime)
        if (endTime != null)
            and(ProjectFagaiStaticalInfo::entryDate le endTime)
        if (minAmount != null)
            and(ProjectFagaiStaticalInfo::plannedTotalInvestment ge minAmount)
        if (maxAmount != null)
            and(ProjectFagaiStaticalInfo::plannedTotalInvestment lt maxAmount)
    }.associate { row ->
        val district = row.getString(ProjectFagaiKeyProjects::district.name, "")
        val park = row.getString(ProjectFagaiKeyProjects::park.name, "")
        district to park to row.getInt("value")
    }

    override fun getStatisticalPlannedTotalInvestment(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
    ) = queryRows {
        from(ProjectFagaiStaticalInfo::class.java)
        leftJoin(ProjectFagaiStaticalInvestment::class.java).on {
            it.and(ProjectFagaiStaticalInvestment::projectName eq ProjectFagaiStaticalInfo::projectName)
            it.and(ProjectFagaiStaticalInvestment::onlineApprovalCode eq ProjectFagaiStaticalInfo::onlineApprovalCode)
        }
        select(ProjectFagaiStaticalInvestment::district)
        groupBy(ProjectFagaiKeyProjects::district.name)
        if (industrialChain.isNotEmpty()) {
            join(ProjectFagaiKeyProjects::class.java)
                .on(ProjectFagaiKeyProjects::statisticalProjectName eq ProjectFagaiStaticalInfo::projectName)
            and {
                it.or(ProjectFagaiKeyProjects::innovativeCluster like industrialChain)
                it.or(ProjectFagaiKeyProjects::industrialChain like industrialChain)
            }
        }
        select(
            QueryMethods.sum(ProjectFagaiStaticalInfo::plannedTotalInvestment)
                .`as`("value"),
        )
        if (startTime != null)
            and(ProjectFagaiStaticalInfo::entryDate ge startTime)
        if (endTime != null)
            and(ProjectFagaiStaticalInfo::entryDate le endTime)
        if (minAmount != null)
            and(ProjectFagaiStaticalInfo::plannedTotalInvestment ge minAmount)
        if (maxAmount != null)
            and(ProjectFagaiStaticalInfo::plannedTotalInvestment lt maxAmount)
    }.associate { row ->
        val district = row.getString(ProjectFagaiKeyProjects::district.name, "")
        val park = row.getString(ProjectFagaiKeyProjects::park.name, "")
        district to park to row.getDouble("value")
    }

    override fun filingProjects(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        projectType: String?,
        // 内资外资
        isForeignInvestment: Boolean?,
    ) = query<KeyProjectsItem> {
        from(ProjectFilingInfo::class.java)
        select(ProjectFilingInfo::district, ProjectFilingInfo::park)
        select(
            QueryMethods.count()
                .`as`(KeyProjectsItem::count.name),
            QueryMethods.sum(ProjectFilingInfo::investmentAmount)
                .`as`(KeyProjectsItem::amount.name)
        )
        groupBy(ProjectFilingInfo::district, ProjectFilingInfo::park)
        from(ProjectFilingInfo::class.java)
        if (projectType != null)
            and(ProjectFilingInfo::projectType eq projectType)
        if (startTime != null)
            and(ProjectFilingInfo::completeFilingTime ge startTime)
        if (endTime != null)
            and(ProjectFilingInfo::completeFilingTime le endTime)
        if (minAmount != null)
            and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
        if (maxAmount != null)
            and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        if (isForeignInvestment != null)
            and(ProjectFilingInfo::isForeignInvestment eq isForeignInvestment)
    }


    override fun useLandState(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        projectType: String?,
        //是否新增用地
        isIncreasement: Boolean?,
        // 是否使用厂房项目
        isFactory: Boolean?,
        // 是否已供土地项目
        isLand: Boolean?,
    ) = query<KeyProjectsItem> {
        select(ProjectFilingInfo::district, ProjectFilingInfo::park)
        select(
            QueryMethods.count()
                .`as`(KeyProjectsItem::count.name)
        )
        select(
            QueryMethods.sum(ProjectFilingInfo::investmentAmount)
                .`as`(KeyProjectsItem::amount.name)
        )
        //后续会查不同的字段
        if (isIncreasement == true) {
            and(ProjectFilingInfo::landUseType eq "新增用地")
        } else if (isIncreasement == false) {
            and(ProjectFilingInfo::landUseType ne "新增用地")
        }
        groupBy(ProjectFilingInfo::district, ProjectFilingInfo::park)
        from(ProjectFilingInfo::class.java)
        if (projectType != null)
            and(ProjectFilingInfo::projectType eq projectType)
        if (startTime != null)
            and(ProjectFilingInfo::completeFilingTime ge startTime)
        if (endTime != null)
            and(ProjectFilingInfo::completeFilingTime le endTime)
        if (minAmount != null)
            and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
        if (maxAmount != null)
            and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
        if (isFactory == true)
            and(ProjectFilingInfo::landUseType eq "租用厂房")
        if (isLand == true)
            and(ProjectFilingInfo::landSupplyProgress like "土地摘牌")
    }

    override fun statisticFilingProjectsForIndustrialChain(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?
    ) = query<KeyProjectsItem> {
        from(ProjectFilingInfo::class.java)
        select(ProjectFilingInfo::innovativeCluster, ProjectFilingInfo::industrialChain)
        groupBy(ProjectFilingInfo::innovativeCluster, ProjectFilingInfo::industrialChain)
        select(
            QueryMethods.count()
                .`as`(KeyProjectsItem::count.name),
            QueryMethods.sum(ProjectFilingInfo::investmentAmount)
                .`as`(KeyProjectsItem::amount.name)
        )
        and(ProjectFilingInfo::innovativeCluster.isNotNull)
        val countyName = investOnlineService.getCountyName()
        and(ProjectFilingInfo::district inList countyName)
        if (startTime != null)
            and(ProjectFilingInfo::completeFilingTime ge startTime)
        if (endTime != null)
            and(ProjectFilingInfo::completeFilingTime le endTime)
        if (minAmount != null)
            and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
        if (maxAmount != null)
            and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))
    }


    override fun reviewState(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        //1环评	2能评	3安评	4施工图审查	5施工许可证
        review: Int?,
        isComplete: Boolean?,
        projectType: String?,
    ) = query<FilingProjectItem> {
        select(ProjectFilingInfo::district, ProjectFilingInfo::park)
        select(
            QueryMethods.count()
                .`as`(FilingProjectItem::total.name)
        )
        groupBy(ProjectFilingInfo::district, ProjectFilingInfo::park)
        if (projectType != null)
            and(ProjectFilingInfo::projectType eq projectType)
        when (review) {
            1 -> if (isComplete == true) {
                and(ProjectFilingInfo::environmentalAssessmentStatus like "已完成")
            } else {
                and(ProjectFilingInfo::environmentalAssessmentStatus like "未完成")
            }

            2 -> if (isComplete == true) {
                and(ProjectFilingInfo::energyAssessmentStatus inList listOf("1.无需能评", "2.已完成"))
            } else {
                and(ProjectFilingInfo::energyAssessmentStatus like "未完成")
            }

            3 -> if (isComplete == true) {
                and(ProjectFilingInfo::safetyAssessmentStatus like "已完成")
            } else {
                and(ProjectFilingInfo::safetyAssessmentStatus like "未完成")
            }

            4 -> if (isComplete == true) {
                and(ProjectFilingInfo::constructionDrawingReviewStatus ne "3.未完成施工图审查")
            } else {
                and(ProjectFilingInfo::constructionDrawingReviewStatus eq "3.未完成施工图审查")
            }

            5 -> if (isComplete == true) {
                and(ProjectFilingInfo::constructionPermitStatus ne "2.未取得施工许可")
            } else {
                and(ProjectFilingInfo::constructionPermitStatus eq "2.未取得施工许可")
            }

            6 -> if (isComplete == true) {
                and(ProjectFilingInfo::planning ne "2.未取得规划许可")
            } else {
                and(ProjectFilingInfo::planning eq "2.未取得规划许可")
            }

            else -> {}
        }
        if (startTime != null)
            and(ProjectFilingInfo::completeFilingTime ge startTime)
        if (endTime != null)
            and(ProjectFilingInfo::completeFilingTime le endTime)
        if (minAmount != null)
            and(ProjectFilingInfo::investmentAmount ge BigDecimal.valueOf(minAmount))
        if (maxAmount != null)
            and(ProjectFilingInfo::investmentAmount lt BigDecimal.valueOf(maxAmount))

    }
}
