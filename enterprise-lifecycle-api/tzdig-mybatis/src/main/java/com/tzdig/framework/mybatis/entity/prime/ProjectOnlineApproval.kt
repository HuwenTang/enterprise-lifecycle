@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDateTime

@Table("project_online_approval")
class ProjectOnlineApproval() : BaseModel<ProjectOnlineApproval>() {
    constructor(init: ProjectOnlineApproval.() -> Unit) : this() {
        this.init()
    }

    /**
     * 项目审批类型
     */
    @Column("approval_type", comment = "项目审批类型")
    var approvalType: String? = null

    /**
     * 备案目录
     */
    @Column("filing_catalog", comment = "备案目录")
    var filingCatalog: String? = null

    /**
     * 备案目录分类
     */
    @Column("filing_catalog_category", comment = "备案目录分类")
    var filingCatalogCategory: String? = null

    /**
     * 项目代码
     */
    @Column("project_code", comment = "项目代码")
    var projectCode: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 是否补办项目
     */
    @Column("is_supplementary_project", comment = "是否补办项目")
    var isSupplementaryProject: String? = null

    /**
     * 申报时间
     */
    @Column("application_time", comment = "申报时间")
    var applicationTime: LocalDateTime? = null

    /**
     * 审核备类型
     */
    @Column("review_filing_type", comment = "审核备类型")
    var reviewFilingType: String? = null

    /**
     * 项目类型
     */
    @Column("project_type", comment = "项目类型")
    var projectType: String? = null

    /**
     * 建设性质
     */
    @Column("construction_nature", comment = "建设性质")
    var constructionNature: String? = null

    /**
     * 项目属性
     */
    @Column("project_attributes", comment = "项目属性")
    var projectAttributes: String? = null

    /**
     * 拟开工时间（年）
     */
    @Column("planned_start_year", comment = "拟开工时间（年）")
    var plannedStartYear: Short? = null

    /**
     * 拟建成时间（年）
     */
    @Column("planned_end_year", comment = "拟建成时间（年）")
    var plannedEndYear: Short? = null

    /**
     * 建设地点
     */
    @Column("construction_location", comment = "建设地点")
    var constructionLocation: String? = null

    /**
     * 国标行业
     */
    @Column("national_industry_standard", comment = "国标行业")
    var nationalIndustryStandard: String? = null

    /**
     * 国标行业代码
     */
    @Column("national_industry_code", comment = "国标行业代码")
    var nationalIndustryCode: String? = null

    /**
     * 管理行业
     */
    @Column("management_industry", comment = "管理行业")
    var managementIndustry: String? = null

    /**
     * 建设规模及内容
     */
    @Column("construction_scale_and_content", comment = "建设规模及内容")
    var constructionScaleAndContent: String? = null

    /**
     * 总投资（万元）
     */
    @Column("total_investment", comment = "总投资（万元）")
    var totalInvestment: Float? = null

    /**
     * 用地面积（公顷）
     */
    @Column("land_area", comment = "用地面积（公顷）")
    var landArea: Float? = null

    /**
     * 新增用地面积（公顷）
     */
    @Column("new_land_area", comment = "新增用地面积（公顷）")
    var newLandArea: Float? = null

    /**
     * 农用地面积（公顷）
     */
    @Column("agricultural_land_area", comment = "农用地面积（公顷）")
    var agriculturalLandArea: Float? = null

    /**
     * 项目资本金（万元）
     */
    @Column("project_capital", comment = "项目资本金（万元）")
    var projectCapital: Float? = null

    /**
     * 资金来源
     */
    @Column("funding_source", comment = "资金来源")
    var fundingSource: String? = null

    /**
     * 是否技改项目
     */
    @Column("is_technical_reform_project", comment = "是否技改项目")
    var isTechnicalReformProject: String? = null

    /**
     * 产业政策类型
     */
    @Column("industrial_policy_type", comment = "产业政策类型")
    var industrialPolicyType: String? = null

    /**
     * 产业结构调整指导目录
     */
    @Column("industry_adjustment_guidance_catalog", comment = "产业结构调整指导目录")
    var industryAdjustmentGuidanceCatalog: String? = null

    /**
     * 是否属于房屋市政工程
     */
    @Column("is_infrastructure_engineering", comment = "是否属于房屋市政工程")
    var isInfrastructureEngineering: String? = null

    /**
     * 是否同意投资平台为项目单位提供融资对接服务
     */
    @Column("agree_to_provide_financing_services", comment = "是否同意投资平台为项目单位提供融资对接服务")
    var agreeToProvideFinancingServices: String? = null

    /**
     * 法人单位
     */
    @Column("legal_company", comment = "法人单位")
    var legalCompany: String? = null

    /**
     * 法人单位登记注册类型
     */
    @Column("legal_company_registration_type", comment = "法人单位登记注册类型")
    var legalCompanyRegistrationType: String? = null

    /**
     * 法人单位证照类型
     */
    @Column("legal_company_document_type", comment = "法人单位证照类型")
    var legalCompanyDocumentType: String? = null

    /**
     * 法人单位证照号码
     */
    @Column("legal_company_document_number", comment = "法人单位证照号码")
    var legalCompanyDocumentNumber: String? = null

    /**
     * 法人单位控股情况
     */
    @Column("legal_company_holding_situation", comment = "法人单位控股情况")
    var legalCompanyHoldingSituation: String? = null

    /**
     * 法人单位联系人
     */
    @Column("legal_company_contact_name", comment = "法人单位联系人")
    var legalCompanyContactName: String? = null

    /**
     * 法人单位手机号码
     */
    @Column("legal_company_contact_phone", comment = "法人单位手机号码")
    var legalCompanyContactPhone: String? = null

    /**
     * 法人单位电子邮箱
     */
    @Column("legal_company_contact_email", comment = "法人单位电子邮箱")
    var legalCompanyContactEmail: String? = null

    /**
     * 法人单位法人代表姓名
     */
    @Column("legal_company_legal_representative", comment = "法人单位法人代表姓名")
    var legalCompanyLegalRepresentative: String? = null

    /**
     * 法人单位是否为该项目的控股单位
     */
    @Column("is_legal_company_controlling_for_project", comment = "法人单位是否为该项目的控股单位")
    var isLegalCompanyControllingForProject: String? = null

    /**
     * 申报单位
     */
    @Column("application_company", comment = "申报单位")
    var applicationCompany: String? = null

    /**
     * 申报单位登记注册类型
     */
    @Column("application_company_registration_type", comment = "申报单位登记注册类型")
    var applicationCompanyRegistrationType: String? = null

    /**
     * 申报单位证照类型
     */
    @Column("application_company_document_type", comment = "申报单位证照类型")
    var applicationCompanyDocumentType: String? = null

    /**
     * 申报单位证照号码
     */
    @Column("application_company_document_number", comment = "申报单位证照号码")
    var applicationCompanyDocumentNumber: String? = null

    /**
     * 申报单位控股情况
     */
    @Column("application_company_holding_situation", comment = "申报单位控股情况")
    var applicationCompanyHoldingSituation: String? = null

    /**
     * 申报单位联系人
     */
    @Column("application_company_contact_name", comment = "申报单位联系人")
    var applicationCompanyContactName: String? = null

    /**
     * 申报单位手机号码
     */
    @Column("application_company_contact_phone", comment = "申报单位手机号码")
    var applicationCompanyContactPhone: String? = null
}
