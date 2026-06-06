package com.tzdig.framework.service

import com.tzdig.framework.model.vo.fagai.FilingProjectItem
import com.tzdig.framework.model.vo.fagai.InvestmentOverview
import com.tzdig.framework.model.vo.fagai.KeyProjectsItem
import com.tzdig.framework.mybatis.bo.ProjectFagaiKeyProjectsStatsVO
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiStaticalInvestment
import java.math.BigDecimal
import java.time.LocalDate

interface FagaiProjectService {
    fun getAllFagaiState(
        status: Int,
        type: Int,
        date: String?,
        industry: String?,
    ): List<ProjectFagaiKeyProjectsStatsVO>

    fun getInvestmentOverviewUnderConstruction(
        monthStartDate: LocalDate,
        monthEndDate: LocalDate,
        yearStartDate: LocalDate,
        yearEndDate: LocalDate,
        minAmount: BigDecimal?,
        maxAmount: BigDecimal?,
    ): InvestmentOverview.UnderConstruction

    fun getInvestmentOverviewStatisticalInvestment(
        monthStartDate: LocalDate,
        monthEndDate: LocalDate,
        yearStartDate: LocalDate,
        yearEndDate: LocalDate,
        minAmount: BigDecimal?,
        maxAmount: BigDecimal?,
    ): InvestmentOverview.StatisticalInvestment

    fun getInvestmentOverviewInvestmentCompletion(
        monthStartDate: LocalDate,
        monthEndDate: LocalDate,
        yearStartDate: LocalDate,
        yearEndDate: LocalDate,
        minAmount: BigDecimal?,
        maxAmount: BigDecimal?,
    ): InvestmentOverview.InvestmentCompletion

    fun getInvestmentOverviewIndustrialChainDistribution(
        monthStartDate: LocalDate,
        monthEndDate: LocalDate,
        yearStartDate: LocalDate,
        yearEndDate: LocalDate,
        minAmount: BigDecimal?,
        maxAmount: BigDecimal?,
    ): InvestmentOverview.IndustrialChainDistribution

    fun statisticKeyProjects(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
        isOut: Boolean?,
        isUnderConstruction: Boolean?,
    ): List<KeyProjectsItem>

    fun statisticKeyProjectsStatisticalInvestment(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
    ): List<KeyProjectsItem>

    fun statisticKeyProjectsInvestment(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
        isStatistical: Boolean?,
    ): List<KeyProjectsItem>

    fun statisticKeyProjectsForIndustrialChain(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        projectType: Int?,
    ): List<KeyProjectsItem>

    fun getStatisticalProjectInfo(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
    ): List<KeyProjectsItem>

    fun getStatisticalInvestment(
        monthStartTime: LocalDate?,
        monthEndTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
    ): Map<Pair<String, String>, ProjectFagaiStaticalInvestment>

    fun getStatisticalInfoIncreasement(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
    ): Map<Pair<String, String>, Int?>

    fun getStatisticalPlannedTotalInvestment(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        industrialChain: String,
    ): Map<Pair<String, String>, Double?>

    fun filingProjects(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        projectType: String?,
        // 内资外资
        isForeignInvestment: Boolean?,
    ): List<KeyProjectsItem>

    fun useLandState(
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
    ): List<KeyProjectsItem>

    fun statisticFilingProjectsForIndustrialChain(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
    ): List<KeyProjectsItem>

    fun reviewState(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        //1环评	2能评	3安评	4施工图审查	5施工许可证 6 规划许可
        review: Int?,
        isComplete: Boolean?,
        projectType: String?,
    ): List<FilingProjectItem>
}
