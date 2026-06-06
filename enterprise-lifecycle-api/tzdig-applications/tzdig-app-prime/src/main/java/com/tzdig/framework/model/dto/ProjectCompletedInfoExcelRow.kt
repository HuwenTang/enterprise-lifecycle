@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectCompletedInfo
import java.math.BigDecimal
import java.time.LocalDate

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectCompletedInfoExcelRow(
    @field:ExcelProperty("建表语句所属年份")
    var yearOfTable: Int? = null,
    @field:ExcelProperty("工业十大行业分类")
    var classification: String? = null,
    @field:ExcelProperty("8个创新型集群")
    var cluster: String? = null,
    @field:ExcelProperty("13条产业链")
    var industry: String? = null,
    @field:ExcelProperty("所属板块")
    var sector: String? = null,
    @field:ExcelProperty("所属园区")
    var park: String? = null,
    @field:ExcelProperty("项目名称")
    var projectName: String? = null,
    @field:ExcelProperty("重点项目")
    var keyProject: String? = null,
    @field:ExcelProperty("成立时间")
    var establishmentTime: LocalDate? = null,
    @field:ExcelProperty("公司名称")
    var companyName: String? = null,
    @field:ExcelProperty("招商内项目名称")
    var investOnlineId: String? = null,
    @field:ExcelProperty("统一信用代码")
    var unifiedCreditCode: String? = null,
    @field:ExcelProperty("新建/存量")
    var newOrHistory: String? = null,
    @field:ExcelProperty("是否规上企业")
    var isUpEnterprise: String? = null,
    @field:ExcelProperty("项目编码")
    var projectCode: String? = null,
    @field:ExcelProperty("建设规模及主要内容")
    var constructionScaleAndMainContent: String? = null,
    @field:ExcelProperty("建设性质")
    var constructionNature: String? = null,
    @field:ExcelProperty("开工时间")
    var commencementTime: LocalDate? = null,
    @field:ExcelProperty("竣工时间")
    var completionTime: LocalDate? = null,
    @field:ExcelProperty("计划总投资内资")
    var plannedTotalInvestmentDomestic: BigDecimal? = null,
    @field:ExcelProperty("计划总投资外资")
    var plannedTotalInvestmentForeign: BigDecimal? = null,
    @field:ExcelProperty("实际完成投资内资")
    var actualCompletionInvestmentDomestic: BigDecimal? = null,
    @field:ExcelProperty("实际完成投资外资")
    var actualCompletionInvestmentForeign: BigDecimal? = null,
    @field:ExcelProperty("行业分类")
    var industryClassification: String? = null,
    @field:ExcelProperty("计划固定资产投资")
    var plannedFixedAssetInvestment: BigDecimal? = null,
    @field:ExcelProperty("实际固定资产投资")
    var actualFixedAssetInvestment: BigDecimal? = null,
    @field:ExcelProperty("固定资产投资占比")
    var fixedAssetInvestmentRatio: BigDecimal? = null,
    @field:ExcelProperty("拟用地面积（亩）")
    var proposedLandArea: BigDecimal? = null,
    @field:ExcelProperty("实际用地面积（亩）")
    var actualLandArea: BigDecimal? = null,
    @field:ExcelProperty("拟租厂房面积（平方米）")
    var proposedRentalFactoryArea: BigDecimal? = null,
    @field:ExcelProperty("实际租厂房面积（平方米）")
    var actualRentalFactoryArea: BigDecimal? = null,
    @field:ExcelProperty("拟购厂房面积（平方米）")
    var proposedPurchaseFactoryArea: BigDecimal? = null,
    @field:ExcelProperty("实际购厂房面积（平方米）")
    var actualPurchaseFactoryArea: BigDecimal? = null,
    @field:ExcelProperty("预期用工人数（人）")
    var expectedEmploymentNumbers: Int? = null,
    @field:ExcelProperty("实际用工人数（人）")
    var actualEmploymentNumbers: Int? = null,
    @field:ExcelProperty("预计新增经济效益-销售")
    var expectedNewEconomicBenefitsSales: BigDecimal? = null,
    @field:ExcelProperty("实际新增经济效益-销售")
    var actualNewEconomicBenefitsSales: BigDecimal? = null,
    @field:ExcelProperty("预计新增经济效益-利润")
    var expectedNewEconomicBenefitsProfit: BigDecimal? = null,
    @field:ExcelProperty("实际新增经济效益-利润")
    var actualNewEconomicBenefitsProfit: BigDecimal? = null,
    @field:ExcelProperty("预计新增经济效益-税金")
    var expectedNewEconomicBenefitsTax: BigDecimal? = null,
    @field:ExcelProperty("实际新增经济效益-税金")
    var actualNewEconomicBenefitsTax: BigDecimal? = null,
    @field:ExcelProperty("亩均税收（万元/千平方米）")
    var taxPerMu: BigDecimal? = null,
    @field:ExcelProperty("计划进归时间")
    var plannedEntryTime: LocalDate? = null,
    @field:ExcelProperty("实际进归时间")
    var actualEntryTime: LocalDate? = null,
    @field:ExcelProperty("是否工业项目")
    var isIndustryProject: Boolean? = null,
) : ExcelRow<ProjectCompletedInfoExcelRow>() {
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
