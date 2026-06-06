@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApproval
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectOnlineApprovalDTO(
    @get:Schema(description = "项目审批类型")
    val approvalType: String?,
    @get:Schema(description = "备案目录")
    val filingCatalog: String?,
    @get:Schema(description = "备案目录分类")
    val filingCatalogCategory: String?,
    @get:Schema(description = "项目代码")
    val projectCode: String?,
    @get:Schema(description = "项目名称")
    val projectName: String?,
    @get:Schema(description = "是否补办项目")
    val isSupplementaryProject: String?,
    @get:Schema(description = "申报时间")
    @param:JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    val applicationTime: LocalDateTime?,
    @get:Schema(description = "审核备类型")
    val reviewFilingType: String?,
    @get:Schema(description = "项目类型")
    val projectType: String?,
    @get:Schema(description = "建设性质")
    val constructionNature: String?,
    @get:Schema(description = "项目属性")
    val projectAttributes: String?,
    @get:Schema(description = "拟开工时间（年）")
    val plannedStartYear: Short?,
    @get:Schema(description = "拟建成时间（年）")
    val plannedEndYear: Short?,
    @get:Schema(description = "建设地点")
    val constructionLocation: String?,
    @get:Schema(description = "国标行业")
    val nationalIndustryStandard: String?,
    @get:Schema(description = "国标行业代码")
    val nationalIndustryCode: String?,
    @get:Schema(description = "管理行业")
    val managementIndustry: String?,
    @get:Schema(description = "建设规模及内容")
    val constructionScaleAndContent: String?,
    @get:Schema(description = "总投资（万元）")
    val totalInvestment: Float?,
    @get:Schema(description = "用地面积（公顷）")
    val landArea: Float?,
    @get:Schema(description = "新增用地面积（公顷）")
    val newLandArea: Float?,
    @get:Schema(description = "农用地面积（公顷）")
    val agriculturalLandArea: Float?,
    @get:Schema(description = "项目资本金（万元）")
    val projectCapital: Float?,
    @get:Schema(description = "资金来源")
    val fundingSource: String?,
    @get:Schema(description = "是否技改项目")
    val isTechnicalReformProject: String?,
    @get:Schema(description = "产业政策类型")
    val industrialPolicyType: String?,
    @get:Schema(description = "产业结构调整指导目录")
    val industryAdjustmentGuidanceCatalog: String?,
    @get:Schema(description = "是否属于房屋市政工程")
    val isInfrastructureEngineering: String?,
    @get:Schema(description = "是否同意投资平台为项目单位提供融资对接服务")
    val agreeToProvideFinancingServices: String?,
    @get:Schema(description = "法人单位")
    val legalCompany: String?,
    @get:Schema(description = "法人单位登记注册类型")
    val legalCompanyRegistrationType: String?,
    @get:Schema(description = "法人单位证照类型")
    val legalCompanyDocumentType: String?,
    @get:Schema(description = "法人单位证照号码")
    val legalCompanyDocumentNumber: String?,
    @get:Schema(description = "法人单位控股情况")
    val legalCompanyHoldingSituation: String?,
    @get:Schema(description = "法人单位联系人")
    val legalCompanyContactName: String?,
    @get:Schema(description = "法人单位手机号码")
    val legalCompanyContactPhone: String?,
    @get:Schema(description = "法人单位电子邮箱")
    val legalCompanyContactEmail: String?,
    @get:Schema(description = "法人单位法人代表姓名")
    val legalCompanyLegalRepresentative: String?,
    @get:Schema(description = "法人单位是否为该项目的控股单位")
    val isLegalCompanyControllingForProject: String?,
    @get:Schema(description = "申报单位")
    val applicationCompany: String?,
    @get:Schema(description = "申报单位登记注册类型")
    val applicationCompanyRegistrationType: String?,
    @get:Schema(description = "申报单位证照类型")
    val applicationCompanyDocumentType: String?,
    @get:Schema(description = "申报单位证照号码")
    val applicationCompanyDocumentNumber: String?,
    @get:Schema(description = "申报单位控股情况")
    val applicationCompanyHoldingSituation: String?,
    @get:Schema(description = "申报单位联系人")
    val applicationCompanyContactName: String?,
    @get:Schema(description = "申报单位手机号码")
    val applicationCompanyContactPhone: String?,
) {
    fun toProjectOnlineApproval(id: String): ProjectOnlineApproval =
        with(ProjectOnlineApproval()) {
            this.id = id
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
