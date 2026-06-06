@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.zsxt

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("t_project_signed_online", comment = "项目在线签约表")
class TProjectSignedOnline() : BaseModel<TProjectSignedOnline>() {
    constructor(init: TProjectSignedOnline.() -> Unit) : this() {
        this.init()
    }

    /**
     * 签约id
     */
    @Column("signed_id", comment = "签约id")
    var signedId: String? = null

    /**
     * 在线审批id
     */
    @Column("online_approvalId", comment = "在线审批id")
    var onlineApprovalId: String? = null

    /**
     * 审批类型
     */
    @Column("approval_type", comment = "审批类型")
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
     * 项目编码
     */
    @Column("project_code", comment = "项目编码")
    var projectCode: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 是否补充项目
     */
    @Column("is_supplementary_project", comment = "是否补充项目")
    var isSupplementaryProject: String? = null

    /**
     * application_time
     */
    @Column("application_time", comment = "application_time")
    var applicationTime: String? = null

    /**
     * 审核备案类型
     */
    @Column("review_filing_type", comment = "审核备案类型")
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
     * 计划开始年份
     */
    @Column("planned_start_year", comment = "计划开始年份")
    var plannedStartYear: Int? = null

    /**
     * 计划结束年份
     */
    @Column("planned_end_year", comment = "计划结束年份")
    var plannedEndYear: Int? = null

    /**
     * 建设地点
     */
    @Column("construction_location", comment = "建设地点")
    var constructionLocation: String? = null

    /**
     * 国民经济行业标准
     */
    @Column("national_industry_standard", comment = "国民经济行业标准")
    var nationalIndustryStandard: String? = null

    /**
     * 国民经济行业代码
     */
    @Column("national_industry_code", comment = "国民经济行业代码")
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
     * 总投资(万元)
     */
    @Column("total_investment", comment = "总投资(万元)")
    var totalInvestment: BigDecimal? = null

    /**
     * 占地面积(亩)
     */
    @Column("land_area", comment = "占地面积(亩)")
    var landArea: BigDecimal? = null

    /**
     * 新增用地面积(亩)
     */
    @Column("new_land_area", comment = "新增用地面积(亩)")
    var newLandArea: BigDecimal? = null

    /**
     * 农用地面积(亩)
     */
    @Column("agricultural_land_area", comment = "农用地面积(亩)")
    var agriculturalLandArea: BigDecimal? = null

    /**
     * 项目资本金(万元)
     */
    @Column("project_capital", comment = "项目资本金(万元)")
    var projectCapital: BigDecimal? = null

    /**
     * 资金来源
     */
    @Column("funding_source", comment = "资金来源")
    var fundingSource: String? = null

    /**
     * 是否技术改造项目
     */
    @Column("is_technical_reform_project", comment = "是否技术改造项目")
    var isTechnicalReformProject: String? = null

    /**
     * 产业政策类型
     */
    @Column("industrial_policy_type", comment = "产业政策类型")
    var industrialPolicyType: String? = null

    /**
     * 产业调整指导目录
     */
    @Column("industry_adjustment_guidance_catalog", comment = "产业调整指导目录")
    var industryAdjustmentGuidanceCatalog: String? = null

    /**
     * 是否基础设施工程
     */
    @Column("is_infrastructure_engineering", comment = "是否基础设施工程")
    var isInfrastructureEngineering: String? = null

    /**
     * 是否同意提供融资服务
     */
    @Column("agree_to_provide_financing_services", comment = "是否同意提供融资服务")
    var agreeToProvideFinancingServices: String? = null

    /**
     * 法人单位
     */
    @Column("legal_company", comment = "法人单位")
    var legalCompany: String? = null

    /**
     * 法人单位登记类型
     */
    @Column("legal_company_registration_type", comment = "法人单位登记类型")
    var legalCompanyRegistrationType: String? = null

    /**
     * 法人单位证件类型
     */
    @Column("legal_company_document_type", comment = "法人单位证件类型")
    var legalCompanyDocumentType: String? = null

    /**
     * 法人单位证件号码
     */
    @Column("legal_company_document_number", comment = "法人单位证件号码")
    var legalCompanyDocumentNumber: String? = null

    /**
     * 法人单位控股情况
     */
    @Column("legal_company_holding_situation", comment = "法人单位控股情况")
    var legalCompanyHoldingSituation: String? = null

    /**
     * 法人单位联系人姓名
     */
    @Column("legal_company_contact_name", comment = "法人单位联系人姓名")
    var legalCompanyContactName: String? = null

    /**
     * 法人单位联系人电话
     */
    @Column("legal_company_contact_phone", comment = "法人单位联系人电话")
    var legalCompanyContactPhone: String? = null

    /**
     * 法人单位联系人邮箱
     */
    @Column("legal_company_contact_email", comment = "法人单位联系人邮箱")
    var legalCompanyContactEmail: String? = null

    /**
     * 法人单位法定代表人
     */
    @Column("legal_company_legal_representative", comment = "法人单位法定代表人")
    var legalCompanyLegalRepresentative: String? = null

    /**
     * 法人单位是否为项目控制方
     */
    @Column("is_legal_company_controlling_for_project", comment = "法人单位是否为项目控制方")
    var isLegalCompanyControllingForProject: String? = null

    /**
     * 申报单位
     */
    @Column("application_company", comment = "申报单位")
    var applicationCompany: String? = null

    /**
     * 申报单位登记类型
     */
    @Column("application_company_registration_type", comment = "申报单位登记类型")
    var applicationCompanyRegistrationType: String? = null

    /**
     * 申报单位证件类型
     */
    @Column("application_company_document_type", comment = "申报单位证件类型")
    var applicationCompanyDocumentType: String? = null

    /**
     * 申报单位证件号码
     */
    @Column("application_company_document_number", comment = "申报单位证件号码")
    var applicationCompanyDocumentNumber: String? = null

    /**
     * 申报单位控股情况
     */
    @Column("application_company_holding_situation", comment = "申报单位控股情况")
    var applicationCompanyHoldingSituation: String? = null

    /**
     * 申报单位联系人姓名
     */
    @Column("application_company_contact_name", comment = "申报单位联系人姓名")
    var applicationCompanyContactName: String? = null

    /**
     * 申报单位联系人电话
     */
    @Column("application_company_contact_phone", comment = "申报单位联系人电话")
    var applicationCompanyContactPhone: String? = null

    /**
     * 1正常 2 异常
     */
    @Column("status", comment = "1正常 2 异常")
    var status: String? = null

    @Transient
    var onlineId: String? = null
}
