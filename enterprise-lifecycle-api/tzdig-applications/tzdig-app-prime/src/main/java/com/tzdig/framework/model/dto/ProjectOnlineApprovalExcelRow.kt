@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.ExcelOptions
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApproval
import java.time.LocalDateTime

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectOnlineApprovalExcelRow(
    @ExcelProperty("项目审批类型")
    var approvalType: String? = null,
    @ExcelProperty("备案目录")
    var filingCatalog: String? = null,
    @ExcelProperty("备案目录分类")
    var filingCatalogCategory: String? = null,
    @ExcelProperty("项目代码")
    var projectCode: String? = null,
    @ExcelProperty("项目名称")
    var projectName: String? = null,
    @ExcelProperty("是否补办项目")
    @ExcelOptions("yes_no")
    var isSupplementaryProject: String? = null,
    @ExcelProperty("申报时间")
    var applicationTime: LocalDateTime? = null,
    @ExcelProperty("审核备类型")
    var reviewFilingType: String? = null,
    @ExcelProperty("项目类型")
    var projectType: String? = null,
    @ExcelProperty("建设性质")
    var constructionNature: String? = null,
    @ExcelProperty("项目属性")
    var projectAttributes: String? = null,
    @ExcelProperty("拟开工时间（年）")
    var plannedStartYear: Short? = null,
    @ExcelProperty("拟建成时间（年）")
    var plannedEndYear: Short? = null,
    @ExcelProperty("建设地点")
    var constructionLocation: String? = null,
    @ExcelProperty("国标行业")
    var nationalIndustryStandard: String? = null,
    @ExcelProperty("国标行业代码")
    var nationalIndustryCode: String? = null,
    @ExcelProperty("管理行业")
    var managementIndustry: String? = null,
    @ExcelProperty("建设规模及内容")
    var constructionScaleAndContent: String? = null,
    @ExcelProperty("总投资（万元）")
    var totalInvestment: Float? = null,
    @ExcelProperty("用地面积（公顷）")
    var landArea: Float? = null,
    @ExcelProperty("新增用地面积（公顷）")
    var newLandArea: Float? = null,
    @ExcelProperty("农用地面积（公顷）")
    var agriculturalLandArea: Float? = null,
    @ExcelProperty("项目资本金（万元）")
    var projectCapital: Float? = null,
    @ExcelProperty("资金来源")
    var fundingSource: String? = null,
    @ExcelProperty("是否技改项目")
    var isTechnicalReformProject: String? = null,
    @ExcelProperty("产业政策类型")
    var industrialPolicyType: String? = null,
    @ExcelProperty("产业结构调整指导目录")
    var industryAdjustmentGuidanceCatalog: String? = null,
    @ExcelProperty("是否属于房屋市政工程")
    var isInfrastructureEngineering: String? = null,
    @ExcelProperty("是否同意投资平台为项目单位提供融资对接服务")
    var agreeToProvideFinancingServices: String? = null,
    @ExcelProperty("法人单位")
    var legalCompany: String? = null,
    @ExcelProperty("法人单位登记注册类型")
    var legalCompanyRegistrationType: String? = null,
    @ExcelProperty("法人单位证照类型")
    var legalCompanyDocumentType: String? = null,
    @ExcelProperty("法人单位证照号码")
    var legalCompanyDocumentNumber: String? = null,
    @ExcelProperty("法人单位控股情况")
    var legalCompanyHoldingSituation: String? = null,
    @ExcelProperty("法人单位联系人")
    var legalCompanyContactName: String? = null,
    @ExcelProperty("法人单位手机号码")
    var legalCompanyContactPhone: String? = null,
    @ExcelProperty("法人单位电子邮箱")
    var legalCompanyContactEmail: String? = null,
    @ExcelProperty("法人单位法人代表姓名")
    var legalCompanyLegalRepresentative: String? = null,
    @ExcelProperty("法人单位是否为该项目的控股单位")
    var isLegalCompanyControllingForProject: String? = null,
    @ExcelProperty("申报单位")
    var applicationCompany: String? = null,
    @ExcelProperty("申报单位登记注册类型")
    var applicationCompanyRegistrationType: String? = null,
    @ExcelProperty("申报单位证照类型")
    var applicationCompanyDocumentType: String? = null,
    @ExcelProperty("申报单位证照号码")
    var applicationCompanyDocumentNumber: String? = null,
    @ExcelProperty("申报单位控股情况")
    var applicationCompanyHoldingSituation: String? = null,
    @ExcelProperty("申报单位联系人")
    var applicationCompanyContactName: String? = null,
    @ExcelProperty("申报单位手机号码")
    var applicationCompanyContactPhone: String? = null,
) : ExcelRow<ProjectOnlineApprovalExcelRow>() {
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
