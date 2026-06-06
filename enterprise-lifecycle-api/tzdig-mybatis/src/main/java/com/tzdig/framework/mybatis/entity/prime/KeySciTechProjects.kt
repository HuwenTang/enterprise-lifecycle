@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal
import java.time.LocalDate

@Table("key_sci_tech_projects", comment = "重点科创项目表")
class KeySciTechProjects() : BaseModel<KeySciTechProjects>() {
    constructor(init: KeySciTechProjects.() -> Unit) : this() {
        this.init()
    }

    /**
     * 企业名称
     */
    @Column("company_name", comment = "企业名称")
    var companyName: String? = null

    /**
     * 统一社会信用代码
     */
    @Column("unified_social_credit_code", comment = "统一社会信用代码")
    var unifiedSocialCreditCode: String? = null

    /**
     * 申报年份
     */
    @Column("application_year", comment = "申报年份")
    var applicationYear: Int? = null

    /**
     * 审核状态
     */
    @Column("review_status", comment = "审核状态")
    var reviewStatus: String? = null

    /**
     * 成立时间
     */
    @Column("establishment_date", comment = "成立时间")
    var establishmentDate: LocalDate? = null

    /**
     * 市区
     */
    @Column("district", comment = "市区")
    var district: String? = null

    /**
     * 园区
     */
    @Column("park", comment = "园区")
    var park: String? = null

    /**
     * 申报类别
     */
    @Column("application_category", comment = "申报类别")
    var applicationCategory: String? = null

    /**
     * 项目类型
     */
    @Column("project_type", comment = "项目类型")
    var projectType: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 是否属8+13+X产业领域(是/否)
     */
    @Column("is_8_13_x_industry", comment = "是否属8+13+X产业领域(是/否)")
    var is813XIndustry: String? = null

    /**
     * 8+13+X产业领域
     */
    @Column("industry_field", comment = "8+13+X产业领域")
    var industryField: String? = null

    /**
     * 主要产品所属的产业链
     */
    @Column("industry_chain", comment = "主要产品所属的产业链")
    var industryChain: String? = null

    /**
     * 核心产品/服务
     */
    @Column("core_product_service", comment = "核心产品/服务")
    var coreProductService: String? = null

    /**
     * 企业法定代表人
     */
    @Column("legal_representative", comment = "企业法定代表人")
    var legalRepresentative: String? = null

    /**
     * 联系人姓名
     */
    @Column("contact_person", comment = "联系人姓名")
    var contactPerson: String? = null

    /**
     * 联系人手机号
     */
    @Column("contact_phone", comment = "联系人手机号")
    var contactPhone: String? = null

    /**
     * 是否有融资需求(是/否)
     */
    @Column("has_financing_needs", comment = "是否有融资需求(是/否)")
    var hasFinancingNeeds: String? = null

    /**
     * 企业在泰研发经费支出（万元）
     */
    @Column("rd_expenditure", comment = "企业在泰研发经费支出（万元）")
    var rdExpenditure: BigDecimal? = null

    /**
     * 企业建设状态
     */
    @Column("construction_status", comment = "企业建设状态")
    var constructionStatus: String? = null

    /**
     * 通讯地址
     */
    @Column("address", comment = "通讯地址")
    var address: String? = null

    /**
     * 是否在市级以上孵化器内
     */
    @Column("in_incubator", comment = "是否在市级以上孵化器内")
    var inIncubator: String? = null

    /**
     * 孵化器
     */
    @Column("incubator_name", comment = "孵化器")
    var incubatorName: String? = null

    /**
     * 有形资产形式
     */
    @Column("tangible_assets_form", comment = "有形资产形式")
    var tangibleAssetsForm: String? = null

    /**
     * 有形资产价值（万元）
     */
    @Column("tangible_assets_value", comment = "有形资产价值（万元）")
    var tangibleAssetsValue: BigDecimal? = null

    /**
     * 应税销售收入（万元）
     */
    @Column("taxable_sales", comment = "应税销售收入（万元）")
    var taxableSales: BigDecimal? = null

    /**
     * 销售产生时间
     */
    @Column("sales_generation_time", comment = "销售产生时间")
    var salesGenerationTime: Int? = null

    /**
     * 是否整体迁入泰州(是/否)
     */
    @Column("is_relocated_to_taizhou", comment = "是否整体迁入泰州(是/否)")
    var isRelocatedToTaizhou: String? = null

    /**
     * 项目来源地
     */
    @Column("project_source_region", comment = "项目来源地")
    var projectSourceRegion: String? = null

    /**
     * I类知识产权：拥有（件）
     */
    @Column("ip_type1_owned", comment = "I类知识产权：拥有（件）")
    var ipType1Owned: Int? = null

    /**
     * I类知识产权：申请（件）
     */
    @Column("ip_type1_applied", comment = "I类知识产权：申请（件）")
    var ipType1Applied: Int? = null

    /**
     * 企业总人数
     */
    @Column("total_employees", comment = "企业总人数")
    var totalEmployees: Int? = null

    /**
     * 缴纳社保超2个月以上人数
     */
    @Column("employees_social_security", comment = "缴纳社保超2个月以上人数")
    var employeesSocialSecurity: Int? = null

    /**
     * 企业研发人员数
     */
    @Column("rd_personnel", comment = "企业研发人员数")
    var rdPersonnel: Int? = null

    /**
     * 企业发展基本情况
     */
    @Column("company_development_status", comment = "企业发展基本情况")
    var companyDevelopmentStatus: String? = null

    /**
     * 申报条件
     */
    @Column("application_conditions", comment = "申报条件")
    var applicationConditions: String? = null

    /**
     * 合作院校/企业名称
     */
    @Column("cooperative_institutions", comment = "合作院校/企业名称")
    var cooperativeInstitutions: String? = null

    /**
     * 总投资额（万元）
     */
    @Column("total_investment", comment = "总投资额（万元）")
    var totalInvestment: BigDecimal? = null

    /**
     * 购买仪器原值（万元）
     */
    @Column("instrument_purchase_value", comment = "购买仪器原值（万元）")
    var instrumentPurchaseValue: BigDecimal? = null

    /**
     * 截止申报投资额（万元）
     */
    @Column("investment_to_date", comment = "截止申报投资额（万元）")
    var investmentToDate: BigDecimal? = null

    /**
     * 截止申报购买仪器原值（万元）
     */
    @Column("instrument_purchase_to_date", comment = "截止申报购买仪器原值（万元）")
    var instrumentPurchaseToDate: BigDecimal? = null

    /**
     * 投资总额度（万元）
     */
    @Column("total_investment_amount", comment = "投资总额度（万元）")
    var totalInvestmentAmount: BigDecimal? = null

    /**
     * 估值（万元）
     */
    @Column("valuation", comment = "估值（万元）")
    var valuation: BigDecimal? = null

    /**
     * 投资机构名称
     */
    @Column("investment_institution", comment = "投资机构名称")
    var investmentInstitution: String? = null

    /**
     * 院士姓名
     */
    @Column("academician_name", comment = "院士姓名")
    var academicianName: String? = null

    /**
     * 类型
     */
    @Column("talent_type", comment = "类型")
    var talentType: String? = null

    /**
     * 参股形式
     */
    @Column("equity_participation_form", comment = "参股形式")
    var equityParticipationForm: String? = null

    /**
     * 参股比例
     */
    @Column("equity_ratio", comment = "参股比例")
    var equityRatio: BigDecimal? = null

    /**
     * 企业主要负责人姓名
     */
    @Column("key_person_name", comment = "企业主要负责人姓名")
    var keyPersonName: String? = null

    /**
     * 职称
     */
    @Column("professional_title", comment = "职称")
    var professionalTitle: String? = null

    /**
     * 所选专业
     */
    @Column("major", comment = "所选专业")
    var major: String? = null

    /**
     * 学历证书编号
     */
    @Column("diploma_number", comment = "学历证书编号")
    var diplomaNumber: String? = null

    /**
     * 担任职务
     */
    @Column("position", comment = "担任职务")
    var position: String? = null

    /**
     * 研发人员/总人数比例
     */
    @Column("rd_personnel_ratio", comment = "研发人员/总人数比例")
    var rdPersonnelRatio: BigDecimal? = null

    /**
     * 人才参股比例
     */
    @Column("talent_equity_ratio", comment = "人才参股比例")
    var talentEquityRatio: BigDecimal? = null

    /**
     * 实际出资额
     */
    @Column("actual_capital_contribution", comment = "实际出资额")
    var actualCapitalContribution: BigDecimal? = null

    /**
     * 年度
     */
    @Column("approval_year", comment = "年度")
    var approvalYear: Int? = null

    /**
     * 获批省份
     */
    @Column("approval_province", comment = "获批省份")
    var approvalProvince: String? = null

    /**
     * 获批项目名称
     */
    @Column("approval_project_name", comment = "获批项目名称")
    var approvalProjectName: String? = null

    /**
     * 获奖项目与现企业关系
     */
    @Column("project_relationship", comment = "获奖项目与现企业关系")
    var projectRelationship: String? = null

    /**
     * 所报知识产权类型
     */
    @Column("ip_type_applied", comment = "所报知识产权类型")
    var ipTypeApplied: String? = null

    /**
     * 拥有高价值知识产权数
     */
    @Column("high_value_ip_count", comment = "拥有高价值知识产权数")
    var highValueIpCount: Int? = null

    /**
     * 拥有I类知识产权数
     */
    @Column("type1_ip_count", comment = "拥有I类知识产权数")
    var type1IpCount: Int? = null

    /**
     * 方式
     */
    @Column("ip_acquisition_method", comment = "方式")
    var ipAcquisitionMethod: String? = null

    /**
     * 科创大赛或人才大赛获奖名称
     */
    @Column("competition_name", comment = "科创大赛或人才大赛获奖名称")
    var competitionName: String? = null

    /**
     * 省份
     */
    @Column("competition_province", comment = "省份")
    var competitionProvince: String? = null

    /**
     * 获奖时间
     */
    @Column("award_year", comment = "获奖时间")
    var awardYear: Int? = null

    /**
     * 获奖人/团队/企业与现企业关系
     */
    @Column("award_relationship", comment = "获奖人/团队/企业与现企业关系")
    var awardRelationship: String? = null

    /**
     * 签约时间
     */
    @Column("signing_date", comment = "签约时间")
    var signingDate: LocalDate? = null

    /**
     * 是否产生销售收入（是/否）
     */
    @Column("has_sales_revenue", comment = "是否产生销售收入（是/否）")
    var hasSalesRevenue: String? = null

    /**
     * 年度研发投入费用
     */
    @Column("annual_rd_expenditure", comment = "年度研发投入费用")
    var annualRdExpenditure: BigDecimal? = null

    /**
     * 投入费用产生时间
     */
    @Column("expenditure_generation_time", comment = "投入费用产生时间")
    var expenditureGenerationTime: Int? = null

    /**
     * 应税销售收入
     */
    @Column("annual_taxable_sales", comment = "应税销售收入")
    var annualTaxableSales: BigDecimal? = null

    /**
     * 年度研发费用占应税销售收入比
     */
    @Column("rd_expenditure_ratio", comment = "年度研发费用占应税销售收入比")
    var rdExpenditureRatio: BigDecimal? = null

    /**
     * 招商项目（是/否）
     */
    @Column("is_investment_project", comment = "招商项目（是/否）")
    var isInvestmentProject: String? = null

    /**
     * 招商项目id
     */
    @Column("investment_project_id", comment = "招商项目id")
    var investmentProjectId: String? = null

    /**
     * 备注
     */
    @Column("project_notes", comment = "备注")
    var projectNotes: String? = null
}
