@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.fasterxml.jackson.annotation.JsonFormat
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApproval
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectOnlineApprovalVO(
    @Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @Schema(description = "项目审批类型")
    @ExcelProperty("项目审批类型")
    val approvalType: String?,
    @Schema(description = "备案目录")
    @ExcelProperty("备案目录")
    val filingCatalog: String?,
    @Schema(description = "备案目录分类")
    @ExcelProperty("备案目录分类")
    val filingCatalogCategory: String?,
    @Schema(description = "项目代码")
    @ExcelProperty("项目代码")
    val projectCode: String?,
    @Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String?,
    @Schema(description = "是否补办项目")
    @ExcelProperty("是否补办项目")
    val isSupplementaryProject: String?,
    @Schema(description = "申报时间")
    @ExcelProperty("申报时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    val applicationTime: LocalDateTime?,
    @Schema(description = "审核备类型")
    @ExcelProperty("审核备类型")
    val reviewFilingType: String?,
    @Schema(description = "项目类型")
    @ExcelProperty("项目类型")
    val projectType: String?,
    @Schema(description = "建设性质")
    @ExcelProperty("建设性质")
    val constructionNature: String?,
    @Schema(description = "项目属性")
    @ExcelProperty("项目属性")
    val projectAttributes: String?,
    @Schema(description = "拟开工时间（年）")
    @ExcelProperty("拟开工时间（年）")
    val plannedStartYear: Short?,
    @Schema(description = "拟建成时间（年）")
    @ExcelProperty("拟建成时间（年）")
    val plannedEndYear: Short?,
    @Schema(description = "建设地点")
    @ExcelProperty("建设地点")
    val constructionLocation: String?,
    @Schema(description = "国标行业")
    @ExcelProperty("国标行业")
    val nationalIndustryStandard: String?,
    @Schema(description = "国标行业代码")
    @ExcelProperty("国标行业代码")
    val nationalIndustryCode: String?,
    @Schema(description = "管理行业")
    @ExcelProperty("管理行业")
    val managementIndustry: String?,
    @Schema(description = "建设规模及内容")
    @ExcelProperty("建设规模及内容")
    val constructionScaleAndContent: String?,
    @Schema(description = "总投资（万元）")
    @ExcelProperty("总投资（万元）")
    val totalInvestment: Float?,
    @Schema(description = "用地面积（公顷）")
    @ExcelProperty("用地面积（公顷）")
    val landArea: Float?,
    @Schema(description = "新增用地面积（公顷）")
    @ExcelProperty("新增用地面积（公顷）")
    val newLandArea: Float?,
    @Schema(description = "农用地面积（公顷）")
    @ExcelProperty("农用地面积（公顷）")
    val agriculturalLandArea: Float?,
    @Schema(description = "项目资本金（万元）")
    @ExcelProperty("项目资本金（万元）")
    val projectCapital: Float?,
    @Schema(description = "资金来源")
    @ExcelProperty("资金来源")
    val fundingSource: String?,
    @Schema(description = "是否技改项目")
    @ExcelProperty("是否技改项目")
    val isTechnicalReformProject: String?,
    @Schema(description = "产业政策类型")
    @ExcelProperty("产业政策类型")
    val industrialPolicyType: String?,
    @Schema(description = "产业结构调整指导目录")
    @ExcelProperty("产业结构调整指导目录")
    val industryAdjustmentGuidanceCatalog: String?,
    @Schema(description = "是否属于房屋市政工程")
    @ExcelProperty("是否属于房屋市政工程")
    val isInfrastructureEngineering: String?,
    @Schema(description = "是否同意投资平台为项目单位提供融资对接服务")
    @ExcelProperty("是否同意投资平台为项目单位提供融资对接服务")
    val agreeToProvideFinancingServices: String?,
    @Schema(description = "法人单位")
    @ExcelProperty("法人单位")
    val legalCompany: String?,
    @Schema(description = "法人单位登记注册类型")
    @ExcelProperty("法人单位登记注册类型")
    val legalCompanyRegistrationType: String?,
    @Schema(description = "法人单位证照类型")
    @ExcelProperty("法人单位证照类型")
    val legalCompanyDocumentType: String?,
    @Schema(description = "法人单位证照号码")
    @ExcelProperty("法人单位证照号码")
    val legalCompanyDocumentNumber: String?,
    @Schema(description = "法人单位控股情况")
    @ExcelProperty("法人单位控股情况")
    val legalCompanyHoldingSituation: String?,
    @Schema(description = "法人单位联系人")
    @ExcelProperty("法人单位联系人")
    val legalCompanyContactName: String?,
    @Schema(description = "法人单位手机号码")
    @ExcelProperty("法人单位手机号码")
    val legalCompanyContactPhone: String?,
    @Schema(description = "法人单位电子邮箱")
    @ExcelProperty("法人单位电子邮箱")
    val legalCompanyContactEmail: String?,
    @Schema(description = "法人单位法人代表姓名")
    @ExcelProperty("法人单位法人代表姓名")
    val legalCompanyLegalRepresentative: String?,
    @Schema(description = "法人单位是否为该项目的控股单位")
    @ExcelProperty("法人单位是否为该项目的控股单位")
    val isLegalCompanyControllingForProject: String?,
    @Schema(description = "申报单位")
    @ExcelProperty("申报单位")
    val applicationCompany: String?,
    @Schema(description = "申报单位登记注册类型")
    @ExcelProperty("申报单位登记注册类型")
    val applicationCompanyRegistrationType: String?,
    @Schema(description = "申报单位证照类型")
    @ExcelProperty("申报单位证照类型")
    val applicationCompanyDocumentType: String?,
    @Schema(description = "申报单位证照号码")
    @ExcelProperty("申报单位证照号码")
    val applicationCompanyDocumentNumber: String?,
    @Schema(description = "申报单位控股情况")
    @ExcelProperty("申报单位控股情况")
    val applicationCompanyHoldingSituation: String?,
    @Schema(description = "申报单位联系人")
    @ExcelProperty("申报单位联系人")
    val applicationCompanyContactName: String?,
    @Schema(description = "申报单位手机号码")
    @ExcelProperty("申报单位手机号码")
    val applicationCompanyContactPhone: String?,
) {
    constructor(record: ProjectOnlineApproval) : this(
        id = record.id,
        approvalType = record.approvalType,
        filingCatalog = record.filingCatalog,
        filingCatalogCategory = record.filingCatalogCategory,
        projectCode = record.projectCode,
        projectName = record.projectName,
        isSupplementaryProject = record.isSupplementaryProject,
        applicationTime = record.applicationTime,
        reviewFilingType = record.reviewFilingType,
        projectType = record.projectType,
        constructionNature = record.constructionNature,
        projectAttributes = record.projectAttributes,
        plannedStartYear = record.plannedStartYear,
        plannedEndYear = record.plannedEndYear,
        constructionLocation = record.constructionLocation,
        nationalIndustryStandard = record.nationalIndustryStandard,
        nationalIndustryCode = record.nationalIndustryCode,
        managementIndustry = record.managementIndustry,
        constructionScaleAndContent = record.constructionScaleAndContent,
        totalInvestment = record.totalInvestment,
        landArea = record.landArea,
        newLandArea = record.newLandArea,
        agriculturalLandArea = record.agriculturalLandArea,
        projectCapital = record.projectCapital,
        fundingSource = record.fundingSource,
        isTechnicalReformProject = record.isTechnicalReformProject,
        industrialPolicyType = record.industrialPolicyType,
        industryAdjustmentGuidanceCatalog = record.industryAdjustmentGuidanceCatalog,
        isInfrastructureEngineering = record.isInfrastructureEngineering,
        agreeToProvideFinancingServices = record.agreeToProvideFinancingServices,
        legalCompany = record.legalCompany,
        legalCompanyRegistrationType = record.legalCompanyRegistrationType,
        legalCompanyDocumentType = record.legalCompanyDocumentType,
        legalCompanyDocumentNumber = record.legalCompanyDocumentNumber,
        legalCompanyHoldingSituation = record.legalCompanyHoldingSituation,
        legalCompanyContactName = record.legalCompanyContactName,
        legalCompanyContactPhone = record.legalCompanyContactPhone,
        legalCompanyContactEmail = record.legalCompanyContactEmail,
        legalCompanyLegalRepresentative = record.legalCompanyLegalRepresentative,
        isLegalCompanyControllingForProject = record.isLegalCompanyControllingForProject,
        applicationCompany = record.applicationCompany,
        applicationCompanyRegistrationType = record.applicationCompanyRegistrationType,
        applicationCompanyDocumentType = record.applicationCompanyDocumentType,
        applicationCompanyDocumentNumber = record.applicationCompanyDocumentNumber,
        applicationCompanyHoldingSituation = record.applicationCompanyHoldingSituation,
        applicationCompanyContactName = record.applicationCompanyContactName,
        applicationCompanyContactPhone = record.applicationCompanyContactPhone,
    )
}
