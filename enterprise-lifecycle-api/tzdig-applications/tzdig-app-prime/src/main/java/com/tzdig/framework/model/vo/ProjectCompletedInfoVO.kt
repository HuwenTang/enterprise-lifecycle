@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectCompletedInfo
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate

data class ProjectCompletedInfoVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "建表语句所属年份")
    @ExcelProperty("建表语句所属年份")
    val yearOfTable: Int?,
    @get:Schema(description = "工业十大行业分类")
    @ExcelProperty("工业十大行业分类")
    val classification: String?,
    @get:Schema(description = "8个创新型集群")
    @ExcelProperty("8个创新型集群")
    val cluster: String?,
    @get:Schema(description = "13条产业链")
    @ExcelProperty("13条产业链")
    val industry: String?,
    @get:Schema(description = "所属板块")
    @ExcelProperty("所属板块")
    val sector: String?,
    @get:Schema(description = "所属园区")
    @ExcelProperty("所属园区")
    val park: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String?,
    @get:Schema(description = "重点项目")
    @ExcelProperty("重点项目")
    val keyProject: String?,
    @get:Schema(description = "成立时间")
    @ExcelProperty("成立时间")
    val establishmentTime: LocalDate?,
    @get:Schema(description = "公司名称")
    @ExcelProperty("公司名称")
    val companyName: String?,
    @get:Schema(description = "招商内项目名称")
    @ExcelProperty("招商内项目名称")
    val investOnlineId: String?,
    @get:Schema(description = "统一信用代码")
    @ExcelProperty("统一信用代码")
    val unifiedCreditCode: String?,
    @get:Schema(description = "新建/存量")
    @ExcelProperty("新建/存量")
    val newOrHistory: String?,
    @get:Schema(description = "是否规上企业")
    @ExcelProperty("是否规上企业")
    val isUpEnterprise: String?,
    @get:Schema(description = "项目编码")
    @ExcelProperty("项目编码")
    val projectCode: String?,
    @get:Schema(description = "建设规模及主要内容")
    @ExcelProperty("建设规模及主要内容")
    val constructionScaleAndMainContent: String?,
    @get:Schema(description = "建设性质")
    @ExcelProperty("建设性质")
    val constructionNature: String?,
    @get:Schema(description = "开工时间")
    @ExcelProperty("开工时间")
    val commencementTime: LocalDate?,
    @get:Schema(description = "竣工时间")
    @ExcelProperty("竣工时间")
    val completionTime: LocalDate?,
    @get:Schema(description = "计划总投资内资")
    @ExcelProperty("计划总投资内资")
    val plannedTotalInvestmentDomestic: BigDecimal?,
    @get:Schema(description = "计划总投资外资")
    @ExcelProperty("计划总投资外资")
    val plannedTotalInvestmentForeign: BigDecimal?,
    @get:Schema(description = "实际完成投资内资")
    @ExcelProperty("实际完成投资内资")
    val actualCompletionInvestmentDomestic: BigDecimal?,
    @get:Schema(description = "实际完成投资外资")
    @ExcelProperty("实际完成投资外资")
    val actualCompletionInvestmentForeign: BigDecimal?,
    @get:Schema(description = "行业分类")
    @ExcelProperty("行业分类")
    val industryClassification: String?,
    @get:Schema(description = "计划固定资产投资")
    @ExcelProperty("计划固定资产投资")
    val plannedFixedAssetInvestment: BigDecimal?,
    @get:Schema(description = "实际固定资产投资")
    @ExcelProperty("实际固定资产投资")
    val actualFixedAssetInvestment: BigDecimal?,
    @get:Schema(description = "固定资产投资占比")
    @ExcelProperty("固定资产投资占比")
    val fixedAssetInvestmentRatio: BigDecimal?,
    @get:Schema(description = "拟用地面积（亩）")
    @ExcelProperty("拟用地面积（亩）")
    val proposedLandArea: BigDecimal?,
    @get:Schema(description = "实际用地面积（亩）")
    @ExcelProperty("实际用地面积（亩）")
    val actualLandArea: BigDecimal?,
    @get:Schema(description = "拟租厂房面积（平方米）")
    @ExcelProperty("拟租厂房面积（平方米）")
    val proposedRentalFactoryArea: BigDecimal?,
    @get:Schema(description = "实际租厂房面积（平方米）")
    @ExcelProperty("实际租厂房面积（平方米）")
    val actualRentalFactoryArea: BigDecimal?,
    @get:Schema(description = "拟购厂房面积（平方米）")
    @ExcelProperty("拟购厂房面积（平方米）")
    val proposedPurchaseFactoryArea: BigDecimal?,
    @get:Schema(description = "实际购厂房面积（平方米）")
    @ExcelProperty("实际购厂房面积（平方米）")
    val actualPurchaseFactoryArea: BigDecimal?,
    @get:Schema(description = "预期用工人数（人）")
    @ExcelProperty("预期用工人数（人）")
    val expectedEmploymentNumbers: Int?,
    @get:Schema(description = "实际用工人数（人）")
    @ExcelProperty("实际用工人数（人）")
    val actualEmploymentNumbers: Int?,
    @get:Schema(description = "预计新增经济效益-销售")
    @ExcelProperty("预计新增经济效益-销售")
    val expectedNewEconomicBenefitsSales: BigDecimal?,
    @get:Schema(description = "实际新增经济效益-销售")
    @ExcelProperty("实际新增经济效益-销售")
    val actualNewEconomicBenefitsSales: BigDecimal?,
    @get:Schema(description = "预计新增经济效益-利润")
    @ExcelProperty("预计新增经济效益-利润")
    val expectedNewEconomicBenefitsProfit: BigDecimal?,
    @get:Schema(description = "实际新增经济效益-利润")
    @ExcelProperty("实际新增经济效益-利润")
    val actualNewEconomicBenefitsProfit: BigDecimal?,
    @get:Schema(description = "预计新增经济效益-税金")
    @ExcelProperty("预计新增经济效益-税金")
    val expectedNewEconomicBenefitsTax: BigDecimal?,
    @get:Schema(description = "实际新增经济效益-税金")
    @ExcelProperty("实际新增经济效益-税金")
    val actualNewEconomicBenefitsTax: BigDecimal?,
    @get:Schema(description = "亩均税收（万元/千平方米）")
    @ExcelProperty("亩均税收（万元/千平方米）")
    val taxPerMu: BigDecimal?,
    @get:Schema(description = "计划进归时间")
    @ExcelProperty("计划进归时间")
    val plannedEntryTime: LocalDate?,
    @get:Schema(description = "实际进归时间")
    @ExcelProperty("实际进归时间")
    val actualEntryTime: LocalDate?,
    @get:Schema(description = "是否工业项目")
    @ExcelProperty("是否工业项目")
    val isIndustryProject: Boolean?,
) {
    constructor(record: ProjectCompletedInfo) : this(
        id = record.id,
        yearOfTable = record.year,
        classification = record.classification,
        cluster = record.cluster,
        industry = record.industry,
        sector = record.sector,
        park = record.park,
        projectName = record.projectName,
        keyProject = record.keyProject,
        establishmentTime = record.establishmentTime,
        companyName = record.companyName,
        investOnlineId = record.investOnlineId,
        unifiedCreditCode = record.unifiedCreditCode,
        newOrHistory = record.newOrHistory,
        isUpEnterprise = record.isUpEnterprise,
        projectCode = record.projectCode,
        constructionScaleAndMainContent = record.constructionScaleAndMainContent,
        constructionNature = record.constructionNature,
        commencementTime = record.commencementTime,
        completionTime = record.completionTime,
        plannedTotalInvestmentDomestic = record.plannedTotalInvestmentDomestic,
        plannedTotalInvestmentForeign = record.plannedTotalInvestmentForeign,
        actualCompletionInvestmentDomestic = record.actualCompletionInvestmentDomestic,
        actualCompletionInvestmentForeign = record.actualCompletionInvestmentForeign,
        industryClassification = record.industryClassification,
        plannedFixedAssetInvestment = record.plannedFixedAssetInvestment,
        actualFixedAssetInvestment = record.actualFixedAssetInvestment,
        fixedAssetInvestmentRatio = record.fixedAssetInvestmentRatio,
        proposedLandArea = record.proposedLandArea,
        actualLandArea = record.actualLandArea,
        proposedRentalFactoryArea = record.proposedRentalFactoryArea,
        actualRentalFactoryArea = record.actualRentalFactoryArea,
        proposedPurchaseFactoryArea = record.proposedPurchaseFactoryArea,
        actualPurchaseFactoryArea = record.actualPurchaseFactoryArea,
        expectedEmploymentNumbers = record.expectedEmploymentNumbers,
        actualEmploymentNumbers = record.actualEmploymentNumbers,
        expectedNewEconomicBenefitsSales = record.expectedNewEconomicBenefitsSales,
        actualNewEconomicBenefitsSales = record.actualNewEconomicBenefitsSales,
        expectedNewEconomicBenefitsProfit = record.expectedNewEconomicBenefitsProfit,
        actualNewEconomicBenefitsProfit = record.actualNewEconomicBenefitsProfit,
        expectedNewEconomicBenefitsTax = record.expectedNewEconomicBenefitsTax,
        actualNewEconomicBenefitsTax = record.actualNewEconomicBenefitsTax,
        taxPerMu = record.taxPerMu,
        plannedEntryTime = record.plannedEntryTime,
        actualEntryTime = record.actualEntryTime,
        isIndustryProject = record.isIndustryProject,
    )
}
