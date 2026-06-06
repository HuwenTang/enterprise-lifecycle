@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApproval
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectOnlineApprovalDTO(
    @Schema(description = "项目审批类型")
    val approvalType: String?,
    @Schema(description = "备案目录")
    val filingCatalog: String?,
    @Schema(description = "备案目录分类")
    val filingCatalogCategory: String?,
    @Schema(description = "项目代码")
    val projectCode: String?,
    @Schema(description = "项目名称")
    val projectName: String?,
    @Schema(description = "是否补办项目")
    val isSupplementaryProject: String?,
    @Schema(description = "申报时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    val applicationTime: LocalDateTime?,
    @Schema(description = "审核备类型")
    val reviewFilingType: String?,
    @Schema(description = "项目类型")
    val projectType: String?,
    @Schema(description = "建设性质")
    val constructionNature: String?,
    @Schema(description = "项目属性")
    val projectAttributes: String?,
    @Schema(description = "拟开工时间（年）")
    val plannedStartYear: Short?,
    @Schema(description = "拟建成时间（年）")
    val plannedEndYear: Short?,
    @Schema(description = "建设地点")
    val constructionLocation: String?,
    @Schema(description = "国标行业")
    val nationalIndustryStandard: String?,
    @Schema(description = "国标行业代码")
    val nationalIndustryCode: String?,
    @Schema(description = "管理行业")
    val managementIndustry: String?,
    @Schema(description = "建设规模及内容")
    val constructionScaleAndContent: String?,
    @Schema(description = "总投资（万元）")
    val totalInvestment: Float?,
    @Schema(description = "用地面积（公顷）")
    val landArea: Float?,
    @Schema(description = "新增用地面积（公顷）")
    val newLandArea: Float?,
    @Schema(description = "农用地面积（公顷）")
    val agriculturalLandArea: Float?,
    @Schema(description = "项目资本金（万元）")
    val projectCapital: Float?,
    @Schema(description = "资金来源")
    val fundingSource: String?,
    @Schema(description = "是否技改项目")
    val isTechnicalReformProject: String?,
    @Schema(description = "产业政策类型")
    val industrialPolicyType: String?,
    @Schema(description = "产业结构调整指导目录")
    val industryAdjustmentGuidanceCatalog: String?,
    @Schema(description = "是否属于房屋市政工程")
    val isInfrastructureEngineering: String?,
    @Schema(description = "是否同意投资平台为项目单位提供融资对接服务")
    val agreeToProvideFinancingServices: String?,
    @Schema(description = "法人单位")
    val legalCompany: String?,
    @Schema(description = "法人单位登记注册类型")
    val legalCompanyRegistrationType: String?,
    @Schema(description = "法人单位证照类型")
    val legalCompanyDocumentType: String?,
    @Schema(description = "法人单位证照号码")
    val legalCompanyDocumentNumber: String?,
    @Schema(description = "法人单位控股情况")
    val legalCompanyHoldingSituation: String?,
    @Schema(description = "法人单位联系人")
    val legalCompanyContactName: String?,
    @Schema(description = "法人单位手机号码")
    val legalCompanyContactPhone: String?,
    @Schema(description = "法人单位电子邮箱")
    val legalCompanyContactEmail: String?,
    @Schema(description = "法人单位法人代表姓名")
    val legalCompanyLegalRepresentative: String?,
    @Schema(description = "法人单位是否为该项目的控股单位")
    val isLegalCompanyControllingForProject: String?,
    @Schema(description = "申报单位")
    val applicationCompany: String?,
    @Schema(description = "申报单位登记注册类型")
    val applicationCompanyRegistrationType: String?,
    @Schema(description = "申报单位证照类型")
    val applicationCompanyDocumentType: String?,
    @Schema(description = "申报单位证照号码")
    val applicationCompanyDocumentNumber: String?,
    @Schema(description = "申报单位控股情况")
    val applicationCompanyHoldingSituation: String?,
    @Schema(description = "申报单位联系人")
    val applicationCompanyContactName: String?,
    @Schema(description = "申报单位手机号码")
    val applicationCompanyContactPhone: String?,
) {
    fun toProjectOnlineApproval(): ProjectOnlineApproval =
        with(ProjectOnlineApproval()) {
            into(this)
        }

    fun into(record: ProjectOnlineApproval): ProjectOnlineApproval {
        record.approvalType = approvalType
        record.filingCatalog = filingCatalog
        record.filingCatalogCategory = filingCatalogCategory
        record.projectCode = projectCode
        record.projectName = projectName
        record.isSupplementaryProject = isSupplementaryProject
        record.applicationTime = applicationTime
        record.reviewFilingType = reviewFilingType
        record.projectType = projectType
        record.constructionNature = constructionNature
        record.projectAttributes = projectAttributes
        record.plannedStartYear = plannedStartYear
        record.plannedEndYear = plannedEndYear
        record.constructionLocation = constructionLocation
        record.nationalIndustryStandard = nationalIndustryStandard
        record.nationalIndustryCode = nationalIndustryCode
        record.managementIndustry = managementIndustry
        record.constructionScaleAndContent = constructionScaleAndContent
        record.totalInvestment = totalInvestment
        record.landArea = landArea
        record.newLandArea = newLandArea
        record.agriculturalLandArea = agriculturalLandArea
        record.projectCapital = projectCapital
        record.fundingSource = fundingSource
        record.isTechnicalReformProject = isTechnicalReformProject
        record.industrialPolicyType = industrialPolicyType
        record.industryAdjustmentGuidanceCatalog = industryAdjustmentGuidanceCatalog
        record.isInfrastructureEngineering = isInfrastructureEngineering
        record.agreeToProvideFinancingServices = agreeToProvideFinancingServices
        record.legalCompany = legalCompany
        record.legalCompanyRegistrationType = legalCompanyRegistrationType
        record.legalCompanyDocumentType = legalCompanyDocumentType
        record.legalCompanyDocumentNumber = legalCompanyDocumentNumber
        record.legalCompanyHoldingSituation = legalCompanyHoldingSituation
        record.legalCompanyContactName = legalCompanyContactName
        record.legalCompanyContactPhone = legalCompanyContactPhone
        record.legalCompanyContactEmail = legalCompanyContactEmail
        record.legalCompanyLegalRepresentative = legalCompanyLegalRepresentative
        record.isLegalCompanyControllingForProject = isLegalCompanyControllingForProject
        record.applicationCompany = applicationCompany
        record.applicationCompanyRegistrationType = applicationCompanyRegistrationType
        record.applicationCompanyDocumentType = applicationCompanyDocumentType
        record.applicationCompanyDocumentNumber = applicationCompanyDocumentNumber
        record.applicationCompanyHoldingSituation = applicationCompanyHoldingSituation
        record.applicationCompanyContactName = applicationCompanyContactName
        record.applicationCompanyContactPhone = applicationCompanyContactPhone
        return record
    }
}
