@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectCompletedInfo
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate

data class ProjectCompletedInfoDTO(
    @param:Schema(description = "建表语句所属年份")
    val yearOfTable: Int?,
    @param:Schema(description = "工业十大行业分类")
    val classification: String?,
    @param:Schema(description = "8个创新型集群")
    val cluster: String?,
    @param:Schema(description = "13条产业链")
    val industry: String?,
    @param:Schema(description = "所属板块")
    val sector: String?,
    @param:Schema(description = "所属园区")
    val park: String?,
    @param:Schema(description = "项目名称")
    val projectName: String?,
    @param:Schema(description = "重点项目")
    val keyProject: String?,
    @param:Schema(description = "成立时间")
    val establishmentTime: LocalDate?,
    @param:Schema(description = "公司名称")
    val companyName: String?,
    @param:Schema(description = "招商内项目名称")
    val investOnlineId: String?,
    @param:Schema(description = "统一信用代码")
    val unifiedCreditCode: String?,
    @param:Schema(description = "新建/存量")
    val newOrHistory: String?,
    @param:Schema(description = "是否规上企业")
    val isUpEnterprise: String?,
    @param:Schema(description = "项目编码")
    val projectCode: String?,
    @param:Schema(description = "建设规模及主要内容")
    val constructionScaleAndMainContent: String?,
    @param:Schema(description = "建设性质")
    val constructionNature: String?,
    @param:Schema(description = "开工时间")
    val commencementTime: LocalDate?,
    @param:Schema(description = "竣工时间")
    val completionTime: LocalDate?,
    @param:Schema(description = "计划总投资内资")
    val plannedTotalInvestmentDomestic: BigDecimal?,
    @param:Schema(description = "计划总投资外资")
    val plannedTotalInvestmentForeign: BigDecimal?,
    @param:Schema(description = "实际完成投资内资")
    val actualCompletionInvestmentDomestic: BigDecimal?,
    @param:Schema(description = "实际完成投资外资")
    val actualCompletionInvestmentForeign: BigDecimal?,
    @param:Schema(description = "行业分类")
    val industryClassification: String?,
    @param:Schema(description = "计划固定资产投资")
    val plannedFixedAssetInvestment: BigDecimal?,
    @param:Schema(description = "实际固定资产投资")
    val actualFixedAssetInvestment: BigDecimal?,
    @param:Schema(description = "固定资产投资占比")
    val fixedAssetInvestmentRatio: BigDecimal?,
    @param:Schema(description = "拟用地面积（亩）")
    val proposedLandArea: BigDecimal?,
    @param:Schema(description = "实际用地面积（亩）")
    val actualLandArea: BigDecimal?,
    @param:Schema(description = "拟租厂房面积（平方米）")
    val proposedRentalFactoryArea: BigDecimal?,
    @param:Schema(description = "实际租厂房面积（平方米）")
    val actualRentalFactoryArea: BigDecimal?,
    @param:Schema(description = "拟购厂房面积（平方米）")
    val proposedPurchaseFactoryArea: BigDecimal?,
    @param:Schema(description = "实际购厂房面积（平方米）")
    val actualPurchaseFactoryArea: BigDecimal?,
    @param:Schema(description = "预期用工人数（人）")
    val expectedEmploymentNumbers: Int?,
    @param:Schema(description = "实际用工人数（人）")
    val actualEmploymentNumbers: Int?,
    @param:Schema(description = "预计新增经济效益-销售")
    val expectedNewEconomicBenefitsSales: BigDecimal?,
    @param:Schema(description = "实际新增经济效益-销售")
    val actualNewEconomicBenefitsSales: BigDecimal?,
    @param:Schema(description = "预计新增经济效益-利润")
    val expectedNewEconomicBenefitsProfit: BigDecimal?,
    @param:Schema(description = "实际新增经济效益-利润")
    val actualNewEconomicBenefitsProfit: BigDecimal?,
    @param:Schema(description = "预计新增经济效益-税金")
    val expectedNewEconomicBenefitsTax: BigDecimal?,
    @param:Schema(description = "实际新增经济效益-税金")
    val actualNewEconomicBenefitsTax: BigDecimal?,
    @param:Schema(description = "亩均税收（万元/千平方米）")
    val taxPerMu: BigDecimal?,
    @param:Schema(description = "计划进归时间")
    val plannedEntryTime: LocalDate?,
    @param:Schema(description = "实际进归时间")
    val actualEntryTime: LocalDate?,
    @param:Schema(description = "是否工业项目")
    val isIndustryProject: Boolean?,
) {
    fun toProjectCompletedInfo(): ProjectCompletedInfo =
        ProjectCompletedInfo {
            into(this)
        }

    fun into(record: ProjectCompletedInfo): ProjectCompletedInfo {
        record.year = yearOfTable
        record.classification = classification
        record.cluster = cluster
        record.industry = industry
        record.sector = sector
        record.park = park
        record.projectName = projectName
        record.keyProject = keyProject
        record.establishmentTime = establishmentTime
        record.companyName = companyName
        record.investOnlineId = investOnlineId
        record.unifiedCreditCode = unifiedCreditCode
        record.newOrHistory = newOrHistory
        record.isUpEnterprise = isUpEnterprise
        record.projectCode = projectCode
        record.constructionScaleAndMainContent = constructionScaleAndMainContent
        record.constructionNature = constructionNature
        record.commencementTime = commencementTime
        record.completionTime = completionTime
        record.plannedTotalInvestmentDomestic = plannedTotalInvestmentDomestic
        record.plannedTotalInvestmentForeign = plannedTotalInvestmentForeign
        record.actualCompletionInvestmentDomestic = actualCompletionInvestmentDomestic
        record.actualCompletionInvestmentForeign = actualCompletionInvestmentForeign
        record.industryClassification = industryClassification
        record.plannedFixedAssetInvestment = plannedFixedAssetInvestment
        record.actualFixedAssetInvestment = actualFixedAssetInvestment
        record.fixedAssetInvestmentRatio = fixedAssetInvestmentRatio
        record.proposedLandArea = proposedLandArea
        record.actualLandArea = actualLandArea
        record.proposedRentalFactoryArea = proposedRentalFactoryArea
        record.actualRentalFactoryArea = actualRentalFactoryArea
        record.proposedPurchaseFactoryArea = proposedPurchaseFactoryArea
        record.actualPurchaseFactoryArea = actualPurchaseFactoryArea
        record.expectedEmploymentNumbers = expectedEmploymentNumbers
        record.actualEmploymentNumbers = actualEmploymentNumbers
        record.expectedNewEconomicBenefitsSales = expectedNewEconomicBenefitsSales
        record.actualNewEconomicBenefitsSales = actualNewEconomicBenefitsSales
        record.expectedNewEconomicBenefitsProfit = expectedNewEconomicBenefitsProfit
        record.actualNewEconomicBenefitsProfit = actualNewEconomicBenefitsProfit
        record.expectedNewEconomicBenefitsTax = expectedNewEconomicBenefitsTax
        record.actualNewEconomicBenefitsTax = actualNewEconomicBenefitsTax
        record.taxPerMu = taxPerMu
        record.plannedEntryTime = plannedEntryTime
        record.actualEntryTime = actualEntryTime
        record.isIndustryProject = isIndustryProject
        return record
    }
}
