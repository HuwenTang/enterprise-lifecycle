@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.KeySciTechProjects
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate

data class KeySciTechProjectsVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "企业名称")
    @ExcelProperty("企业名称")
    val companyName: String?,
    @get:Schema(description = "统一社会信用代码")
    @ExcelProperty("统一社会信用代码")
    val unifiedSocialCreditCode: String?,
    @get:Schema(description = "申报年份")
    @ExcelProperty("申报年份")
    val applicationYear: Int?,
    @get:Schema(description = "审核状态")
    @ExcelProperty("审核状态")
    val reviewStatus: String?,
    @get:Schema(description = "成立时间")
    @ExcelProperty("成立时间")
    val establishmentDate: LocalDate?,
    @get:Schema(description = "市区")
    @ExcelProperty("市区")
    val district: String?,
    @get:Schema(description = "园区")
    @ExcelProperty("园区")
    val park: String?,
    @get:Schema(description = "申报类别")
    @ExcelProperty("申报类别")
    val applicationCategory: String?,
    @get:Schema(description = "项目类型")
    @ExcelProperty("项目类型")
    val projectType: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String?,
    @get:Schema(description = "是否属8+13+X产业领域(是/否)")
    @ExcelProperty("是否属8+13+X产业领域(是/否)")
    val is813XIndustry: String?,
    @get:Schema(description = "8+13+X产业领域")
    @ExcelProperty("8+13+X产业领域")
    val industryField: String?,
    @get:Schema(description = "主要产品所属的产业链")
    @ExcelProperty("主要产品所属的产业链")
    val industryChain: String?,
    @get:Schema(description = "核心产品/服务")
    @ExcelProperty("核心产品/服务")
    val coreProductService: String?,
    @get:Schema(description = "企业法定代表人")
    @ExcelProperty("企业法定代表人")
    val legalRepresentative: String?,
    @get:Schema(description = "联系人姓名")
    @ExcelProperty("联系人姓名")
    val contactPerson: String?,
    @get:Schema(description = "联系人手机号")
    @ExcelProperty("联系人手机号")
    val contactPhone: String?,
    @get:Schema(description = "是否有融资需求(是/否)")
    @ExcelProperty("是否有融资需求(是/否)")
    val hasFinancingNeeds: String?,
    @get:Schema(description = "企业在泰研发经费支出（万元）")
    @ExcelProperty("企业在泰研发经费支出（万元）")
    val rdExpenditure: BigDecimal?,
    @get:Schema(description = "企业建设状态")
    @ExcelProperty("企业建设状态")
    val constructionStatus: String?,
    @get:Schema(description = "通讯地址")
    @ExcelProperty("通讯地址")
    val address: String?,
    @get:Schema(description = "是否在市级以上孵化器内")
    @ExcelProperty("是否在市级以上孵化器内")
    val inIncubator: String?,
    @get:Schema(description = "孵化器")
    @ExcelProperty("孵化器")
    val incubatorName: String?,
    @get:Schema(description = "有形资产形式")
    @ExcelProperty("有形资产形式")
    val tangibleAssetsForm: String?,
    @get:Schema(description = "有形资产价值（万元）")
    @ExcelProperty("有形资产价值（万元）")
    val tangibleAssetsValue: BigDecimal?,
    @get:Schema(description = "应税销售收入（万元）")
    @ExcelProperty("应税销售收入（万元）")
    val taxableSales: BigDecimal?,
    @get:Schema(description = "销售产生时间")
    @ExcelProperty("销售产生时间")
    val salesGenerationTime: Int?,
    @get:Schema(description = "是否整体迁入泰州(是/否)")
    @ExcelProperty("是否整体迁入泰州(是/否)")
    val isRelocatedToTaizhou: String?,
    @get:Schema(description = "项目来源地")
    @ExcelProperty("项目来源地")
    val projectSourceRegion: String?,
    @get:Schema(description = "I类知识产权：拥有（件）")
    @ExcelProperty("I类知识产权：拥有（件）")
    val ipType1Owned: Int?,
    @get:Schema(description = "I类知识产权：申请（件）")
    @ExcelProperty("I类知识产权：申请（件）")
    val ipType1Applied: Int?,
    @get:Schema(description = "企业总人数")
    @ExcelProperty("企业总人数")
    val totalEmployees: Int?,
    @get:Schema(description = "缴纳社保超2个月以上人数")
    @ExcelProperty("缴纳社保超2个月以上人数")
    val employeesSocialSecurity: Int?,
    @get:Schema(description = "企业研发人员数")
    @ExcelProperty("企业研发人员数")
    val rdPersonnel: Int?,
    @get:Schema(description = "企业发展基本情况")
    @ExcelProperty("企业发展基本情况")
    val companyDevelopmentStatus: String?,
    @get:Schema(description = "申报条件")
    @ExcelProperty("申报条件")
    val applicationConditions: String?,
    @get:Schema(description = "合作院校/企业名称")
    @ExcelProperty("合作院校/企业名称")
    val cooperativeInstitutions: String?,
    @get:Schema(description = "总投资额（万元）")
    @ExcelProperty("总投资额（万元）")
    val totalInvestment: BigDecimal?,
    @get:Schema(description = "购买仪器原值（万元）")
    @ExcelProperty("购买仪器原值（万元）")
    val instrumentPurchaseValue: BigDecimal?,
    @get:Schema(description = "截止申报投资额（万元）")
    @ExcelProperty("截止申报投资额（万元）")
    val investmentToDate: BigDecimal?,
    @get:Schema(description = "截止申报购买仪器原值（万元）")
    @ExcelProperty("截止申报购买仪器原值（万元）")
    val instrumentPurchaseToDate: BigDecimal?,
    @get:Schema(description = "投资总额度（万元）")
    @ExcelProperty("投资总额度（万元）")
    val totalInvestmentAmount: BigDecimal?,
    @get:Schema(description = "估值（万元）")
    @ExcelProperty("估值（万元）")
    val valuation: BigDecimal?,
    @get:Schema(description = "投资机构名称")
    @ExcelProperty("投资机构名称")
    val investmentInstitution: String?,
    @get:Schema(description = "院士姓名")
    @ExcelProperty("院士姓名")
    val academicianName: String?,
    @get:Schema(description = "类型")
    @ExcelProperty("类型")
    val talentType: String?,
    @get:Schema(description = "参股形式")
    @ExcelProperty("参股形式")
    val equityParticipationForm: String?,
    @get:Schema(description = "参股比例")
    @ExcelProperty("参股比例")
    val equityRatio: BigDecimal?,
    @get:Schema(description = "企业主要负责人姓名")
    @ExcelProperty("企业主要负责人姓名")
    val keyPersonName: String?,
    @get:Schema(description = "职称")
    @ExcelProperty("职称")
    val professionalTitle: String?,
    @get:Schema(description = "所选专业")
    @ExcelProperty("所选专业")
    val major: String?,
    @get:Schema(description = "学历证书编号")
    @ExcelProperty("学历证书编号")
    val diplomaNumber: String?,
    @get:Schema(description = "担任职务")
    @ExcelProperty("担任职务")
    val position: String?,
    @get:Schema(description = "研发人员/总人数比例")
    @ExcelProperty("研发人员/总人数比例")
    val rdPersonnelRatio: BigDecimal?,
    @get:Schema(description = "人才参股比例")
    @ExcelProperty("人才参股比例")
    val talentEquityRatio: BigDecimal?,
    @get:Schema(description = "实际出资额")
    @ExcelProperty("实际出资额")
    val actualCapitalContribution: BigDecimal?,
    @get:Schema(description = "年度")
    @ExcelProperty("年度")
    val approvalYear: Int?,
    @get:Schema(description = "获批省份")
    @ExcelProperty("获批省份")
    val approvalProvince: String?,
    @get:Schema(description = "获批项目名称")
    @ExcelProperty("获批项目名称")
    val approvalProjectName: String?,
    @get:Schema(description = "获奖项目与现企业关系")
    @ExcelProperty("获奖项目与现企业关系")
    val projectRelationship: String?,
    @get:Schema(description = "所报知识产权类型")
    @ExcelProperty("所报知识产权类型")
    val ipTypeApplied: String?,
    @get:Schema(description = "拥有高价值知识产权数")
    @ExcelProperty("拥有高价值知识产权数")
    val highValueIpCount: Int?,
    @get:Schema(description = "拥有I类知识产权数")
    @ExcelProperty("拥有I类知识产权数")
    val type1IpCount: Int?,
    @get:Schema(description = "方式")
    @ExcelProperty("方式")
    val ipAcquisitionMethod: String?,
    @get:Schema(description = "科创大赛或人才大赛获奖名称")
    @ExcelProperty("科创大赛或人才大赛获奖名称")
    val competitionName: String?,
    @get:Schema(description = "省份")
    @ExcelProperty("省份")
    val competitionProvince: String?,
    @get:Schema(description = "获奖时间")
    @ExcelProperty("获奖时间")
    val awardYear: Int?,
    @get:Schema(description = "获奖人/团队/企业与现企业关系")
    @ExcelProperty("获奖人/团队/企业与现企业关系")
    val awardRelationship: String?,
    @get:Schema(description = "签约时间")
    @ExcelProperty("签约时间")
    val signingDate: LocalDate?,
    @get:Schema(description = "是否产生销售收入（是/否）")
    @ExcelProperty("是否产生销售收入（是/否）")
    val hasSalesRevenue: String?,
    @get:Schema(description = "年度研发投入费用")
    @ExcelProperty("年度研发投入费用")
    val annualRdExpenditure: BigDecimal?,
    @get:Schema(description = "投入费用产生时间")
    @ExcelProperty("投入费用产生时间")
    val expenditureGenerationTime: Int?,
    @get:Schema(description = "应税销售收入")
    @ExcelProperty("应税销售收入")
    val annualTaxableSales: BigDecimal?,
    @get:Schema(description = "年度研发费用占应税销售收入比")
    @ExcelProperty("年度研发费用占应税销售收入比")
    val rdExpenditureRatio: BigDecimal?,
    @get:Schema(description = "招商项目（是/否）")
    @ExcelProperty("招商项目（是/否）")
    val isInvestmentProject: String?,
    @get:Schema(description = "招商项目id")
    @ExcelProperty("招商项目id")
    val investmentProjectId: String?,
    @get:Schema(description = "备注")
    @ExcelProperty("备注")
    val projectNotes: String?,
) {
    constructor(record: KeySciTechProjects) : this(
        id = record.id,
        companyName = record.companyName,
        unifiedSocialCreditCode = record.unifiedSocialCreditCode,
        applicationYear = record.applicationYear,
        reviewStatus = record.reviewStatus,
        establishmentDate = record.establishmentDate,
        district = record.district,
        park = record.park,
        applicationCategory = record.applicationCategory,
        projectType = record.projectType,
        projectName = record.projectName,
        is813XIndustry = record.is813XIndustry,
        industryField = record.industryField,
        industryChain = record.industryChain,
        coreProductService = record.coreProductService,
        legalRepresentative = record.legalRepresentative,
        contactPerson = record.contactPerson,
        contactPhone = record.contactPhone,
        hasFinancingNeeds = record.hasFinancingNeeds,
        rdExpenditure = record.rdExpenditure,
        constructionStatus = record.constructionStatus,
        address = record.address,
        inIncubator = record.inIncubator,
        incubatorName = record.incubatorName,
        tangibleAssetsForm = record.tangibleAssetsForm,
        tangibleAssetsValue = record.tangibleAssetsValue,
        taxableSales = record.taxableSales,
        salesGenerationTime = record.salesGenerationTime,
        isRelocatedToTaizhou = record.isRelocatedToTaizhou,
        projectSourceRegion = record.projectSourceRegion,
        ipType1Owned = record.ipType1Owned,
        ipType1Applied = record.ipType1Applied,
        totalEmployees = record.totalEmployees,
        employeesSocialSecurity = record.employeesSocialSecurity,
        rdPersonnel = record.rdPersonnel,
        companyDevelopmentStatus = record.companyDevelopmentStatus,
        applicationConditions = record.applicationConditions,
        cooperativeInstitutions = record.cooperativeInstitutions,
        totalInvestment = record.totalInvestment,
        instrumentPurchaseValue = record.instrumentPurchaseValue,
        investmentToDate = record.investmentToDate,
        instrumentPurchaseToDate = record.instrumentPurchaseToDate,
        totalInvestmentAmount = record.totalInvestmentAmount,
        valuation = record.valuation,
        investmentInstitution = record.investmentInstitution,
        academicianName = record.academicianName,
        talentType = record.talentType,
        equityParticipationForm = record.equityParticipationForm,
        equityRatio = record.equityRatio,
        keyPersonName = record.keyPersonName,
        professionalTitle = record.professionalTitle,
        major = record.major,
        diplomaNumber = record.diplomaNumber,
        position = record.position,
        rdPersonnelRatio = record.rdPersonnelRatio,
        talentEquityRatio = record.talentEquityRatio,
        actualCapitalContribution = record.actualCapitalContribution,
        approvalYear = record.approvalYear,
        approvalProvince = record.approvalProvince,
        approvalProjectName = record.approvalProjectName,
        projectRelationship = record.projectRelationship,
        ipTypeApplied = record.ipTypeApplied,
        highValueIpCount = record.highValueIpCount,
        type1IpCount = record.type1IpCount,
        ipAcquisitionMethod = record.ipAcquisitionMethod,
        competitionName = record.competitionName,
        competitionProvince = record.competitionProvince,
        awardYear = record.awardYear,
        awardRelationship = record.awardRelationship,
        signingDate = record.signingDate,
        hasSalesRevenue = record.hasSalesRevenue,
        annualRdExpenditure = record.annualRdExpenditure,
        expenditureGenerationTime = record.expenditureGenerationTime,
        annualTaxableSales = record.annualTaxableSales,
        rdExpenditureRatio = record.rdExpenditureRatio,
        isInvestmentProject = record.isInvestmentProject,
        investmentProjectId = record.investmentProjectId,
        projectNotes = record.projectNotes,
    )
}
