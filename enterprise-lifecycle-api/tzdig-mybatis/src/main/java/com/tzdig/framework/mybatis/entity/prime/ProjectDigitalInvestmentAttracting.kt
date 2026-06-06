@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.EnumValue
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDate
import java.time.LocalDateTime

@Table("project_digital_investment_attracting", comment = "数字化招商")
class ProjectDigitalInvestmentAttracting() : BaseModel<ProjectDigitalInvestmentAttracting>() {
    constructor(init: ProjectDigitalInvestmentAttracting.() -> Unit) : this() {
        this.init()
    }

    @Column(isLogicDelete = true)
    public override var deleted: Boolean = false

    /**
     * 项目编号
     */
    @Column("project_code", comment = "项目编号")
    var projectCode: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 所属区县
     */
    @Column("district", comment = "所属区县")
    var district: String? = null

    /**
     * 所属园区
     */
    @Column("park", comment = "所属园区")
    var park: String? = null

    /**
     * 项目审核状态
     */
    @Column(
        "audit_status",
        comment = "项目审核状态（0，1：部门审核中，2：部门审核通过，3：部门审核退回，4专班审核中，5专班审核通过，6专班审核退回）"
    )
    var auditStatus: Int? = null


    /**
     * 开工审核状态
     */
    @Column(
        "audit_status_kaigong",
        comment = "项目审核状态（0，1：部门审核中，2：部门审核通过，3：部门审核退回，4专班审核中，5专班审核通过，6专班审核退回）"
    )
    var auditStatusKaigong: Int? = null

    /**
     * 国民经济分类
     */
    @Column("national_economic_classification", comment = "国民经济分类")
    var nationalEconomicClassification: String? = null

    /**
     * 统一社会信用代码
     */
    @Column("uscc", comment = "统一社会信用代码")
    var uscc: String? = null

    /**
     * 企业名称
     */
    @Column("company_name", comment = "企业名称")
    var companyName: String? = null

    /**
     * 企业注册资金
     */
    @Column("company_registration_funds", comment = "企业注册资金")
    var companyRegistrationFunds: Double? = null

    /**
     * 企业注册日期
     */
    @Column("company_registration_date", comment = "企业注册日期")
    var companyRegistrationDate: LocalDate? = null

    /**
     * 项目类别
     */
    @Column("project_category", comment = "项目类别")
    var projectCategory: String? = null

    /**
     * 项目属性
     */
    @Column("project_attribute", comment = "项目属性")
    var projectAttribute: String? = null

    /**
     * 项目内容
     */
    @Column("project_content", comment = "项目内容")
    var projectContent: String? = null

    /**
     * 投资标识
     */
    @Column("investment_flag", comment = "投资标识")
    var investmentFlag: String? = null

    /**
     * 国别/地区
     */
    @Column("country_region", comment = "国别/地区")
    var countryRegion: String? = null

    /**
     * 具体国别/地区
     */
    @Column("specific_country_region", comment = "具体国别/地区")
    var specificCountryRegion: String? = null

    /**
     * 投资方
     */
    @Column("investor", comment = "投资方")
    var investor: String? = null

    /**
     * 投资金额（亿美元/亿元）
     */
    @Column("investment_amount", comment = "投资金额（亿美元/亿元）")
    var investmentAmount: Double? = null

    /**
     * 注册资本（亿美元/亿元）
     */
    @Column("registered_capital", comment = "注册资本（亿美元/亿元）")
    var registeredCapital: String? = null

    /**
     * 洽谈进度
     */
    @Column("negotiation_progress", comment = "洽谈进度")
    var negotiationProgress: String? = null

    /**
     * 国民经济行业分类
     */
    @Column("industry_classification", comment = "国民经济行业分类")
    var industryClassification: String? = null

    /**
     * 当前项目进度
     */
    @Column("current_project_progress", comment = "当前项目进度")
    var currentProjectProgress: ProjectProgress? = null

    enum class ProjectProgress(
        @EnumValue val value: String,
        val label: String,
    ) {
        /**
         * 在谈
         */
        NEGOTIATION("1", "在谈"),

        /**
         * 签约
         */
        SIGNING("2", "签约"),

        /**
         * 注册
         */
        REGISTRATION("3", "注册"),

        /**
         * 备案
         */
        RECORD("4", "备案"),

        /**
         * 报批
         */
        APPROVAL("5", "报批"),

        /**
         * 开工
         */
        START("6", "开工"),

        /**
         * 竣工
         */
        COMPLETION("7", "竣工"),
    }

    /**
     * 入库时间
     */
    @Column("entry_time", comment = "入库时间")
    var entryTime: LocalDateTime? = null

    /**
     * 注册信息统计日期
     */
    @Column("registration_info_statistics_date", comment = "注册信息统计日期")
    var registrationInfoStatisticsDate: LocalDate? = null

    /**
     * 佐证资料（营业执照）
     */
    @Column("certificate_data_business_license", comment = "佐证资料（营业执照）")
    var certificateDataBusinessLicense: String? = null

    /**
     * 备案（核准）项目名称
     */
    @Column("filing_approval_project_name", comment = "备案（核准）项目名称")
    var filingApprovalProjectName: String? = null

    /**
     * 备案（核准）投资总额（亿元）
     */
    @Column("filing_approval_investment_total", comment = "备案（核准）投资总额（亿元）")
    var filingApprovalInvestmentTotal: Double? = null

    /**
     * 备案（核准）日期
     */
    @Column("filing_approval_date", comment = "备案（核准）日期")
    var filingApprovalDate: LocalDate? = null

    /**
     * 备案信息统计日期
     */
    @Column("filing_info_statistics_date", comment = "备案信息统计日期")
    var filingInfoStatisticsDate: LocalDate? = null

    /**
     * 佐证资料（项目备案（核准）文件）
     */
    @Column("certificate_data_project_filing_approval_file", comment = "佐证资料（项目备案（核准）文件）")
    var certificateDataProjectFilingApprovalFile: String? = null

    /**
     * 是否涉及固定资产投资项目
     */
    @Column("is_fixed_asset_investment", comment = "是否涉及固定资产投资项目")
    var yesFixedAssetInvestment: Boolean? = null

    /**
     * 是否涉及建设用地
     */
    @Column("is_construction_land", comment = "是否涉及建设用地")
    var isConstructionLand: Boolean? = null

    /**
     * 建设用地规划许可证编号
     */
    @Column("construction_land_planning_permit_number", comment = "建设用地规划许可证编号")
    var constructionLandPlanningPermitNumber: String? = null

    /**
     * 取得许可证日期
     */
    @Column("permit_obtain_date", comment = "取得许可证日期")
    var permitObtainDate: LocalDate? = null

    /**
     * 完成报批统计日期
     */
    @Column("completion_report_statistics_date", comment = "完成报批统计日期")
    var completionReportStatisticsDate: LocalDate? = null

    /**
     * 佐证资料
     */
    @Column("certificate_data", comment = "佐证资料")
    var certificateData: String? = null

    /**
     * 开工确认日期
     */
    @Column("start_confirm_date", comment = "开工确认日期")
    var startConfirmDate: LocalDate? = null

    /**
     * 竣工确认日期
     */
    @Column("end_confirm_date", comment = "竣工确认日期")
    var endConfirmDate: LocalDate? = null

    /**
     * 是否为新引进企业
     */
    @Column("is_new_introduced_enterprise", comment = "是否为新引进企业")
    var isNewIntroducedEnterprise: Boolean? = null

    /**
     * 项目评级（内资、外资；金额分级）
     */
    @Column("project_rating", comment = "项目评级（内资、外资；金额分级）")
    var projectRating: String? = null

    /**
     * 主要投资方名称
     */
    @Column("main_investor_name", comment = "主要投资方名称")
    var mainInvestorName: String? = null

    /**
     * 计划总投资（亿元）
     */
    @Column("planned_total_investment", comment = "计划总投资（亿元）")
    var plannedTotalInvestment: String? = null

    /**
     * 项目选址位置
     */
    @Column("project_location", comment = "项目选址位置")
    var projectLocation: String? = null

    /**
     * 是否为招商会项目
     */
    @Column("is_recruitment_fair_project", comment = "是否为招商会项目")
    var isRecruitmentFairProject: Boolean? = null

    /**
     * 招商会名称
     */
    @Column("recruitment_fair_name", comment = "招商会名称")
    var recruitmentFairName: String? = null

    /**
     * 签约统计时间
     */
    @Column("signing_time", comment = "签约统计时间")
    var signingTime: LocalDate? = null

    /**
     * 实际签约时间
     */
    @Column("actual_signing_time", comment = "实际签约时间")
    var actualSigningTime: LocalDate? = null

    /**
     * 签约合同
     */
    @Column("signing_contract", comment = "签约合同")
    var signingContract: String? = null

    /**
     * 项目总投资额（亿美元）
     */
    @Column("total_investment_usd", comment = "项目总投资额（亿美元）")
    var totalInvestmentUsd: Double? = null

    /**
     * 项目总投资额（亿元）
     */
    @Column("total_investment_cny", comment = "项目总投资额（亿元）")
    var totalInvestmentCny: Double? = null

    /**
     * 项目来源
     */
    @Column("project_source", comment = "项目来源")
    var projectSource: String? = null

    /**
     * 厂房类型
     */
    @Column("factory_type", comment = "厂房类型")
    var factoryType: String? = null

    /**
     * 拟用地面积（平方米）
     */
    @Column("planned_land_area", comment = "拟用地面积（平方米）")
    var plannedLandArea: Float? = null

    /**
     * 拟租厂房面积（平方米）
     */
    @Column("planned_rental_factory_area", comment = "拟租厂房面积（平方米）")
    var plannedRentalFactoryArea: Float? = null

    /**
     * 拟购厂房面积（平方米）
     */
    @Column("planned_purchase_factory_area", comment = "拟购厂房面积（平方米）")
    var plannedPurchaseFactoryArea: Float? = null

    /**
     * 预计年销量（万元）
     */
    @Column("expected_annual_sales", comment = "预计年销量（万元）")
    var expectedAnnualSales: Float? = null

    /**
     * 预计年销售（万元）
     */
    @Column("expected_annual_sales_amount", comment = "预计年销售（万元）")
    var expectedAnnualSalesAmount: Float? = null

    /**
     * 预计年税收（万元）
     */
    @Column("expected_annual_tax", comment = "预计年税收（万元）")
    var expectedAnnualTax: Float? = null

    /**
     * 项目类型
     */
    @Column("project_type", comment = "项目类型")
    var projectType: String? = null

    /**
     * 产业大类名称
     */
    @Column("industry_major_class_name", comment = "产业大类名称")
    var industryMajorClassName: String? = null

    /**
     * 所属行业
     */
    @Column("belonging_industry", comment = "所属行业")
    var belongingIndustry: String? = null

    /**
     * 投资方性质
     */
    @Column("investor_nature", comment = "投资方性质")
    var investorNature: String? = null

    /**
     * 项目简介
     */
    @Column("project_profile", comment = "项目简介")
    var projectProfile: String? = null

    /**
     * 是否为世界500强或全球专业领域行业龙头企业
     */
    @Column("is_world_top_500_or_leading_global_company", comment = "是否为世界500强或全球专业领域行业龙头企业")
    var isWorldTop500OrLeadingGlobalCompany: Boolean? = null

    /**
     * 是否为国内500强或国内行业排名前100企业
     */
    @Column("is_domestic_top_500_or_top_100_company", comment = "是否为国内500强或国内行业排名前100企业")
    var isDomesticTop500OrTop100Company: Boolean? = null

    /**
     * 是否为上市公司或上市辅导期企业
     */
    @Column("is_publicly_traded_or_pre_IPO_company", comment = "是否为上市公司或上市辅导期企业")
    var isPubliclyTradedOrPreIPOCompany: Boolean? = null

    /**
     * 是否为瞪羚、专精特新、独角兽企业
     */
    @Column("is_unicorn_startup", comment = "是否为瞪羚、专精特新、独角兽企业")
    var isUnicornStartup: Boolean? = null

    /**
     * 已投资项目对属地政府亩均税收（万元）
     */
    @Column("average_tax_per_mu_of_existing_investment", comment = "已投资项目对属地政府亩均税收（万元）")
    var averageTaxPerMuOfExistingInvestment: Float? = null

    /**
     * 主要客户
     */
    @Column("major_customers", comment = "主要客户")
    var majorCustomers: String? = null

    /**
     * 固定资产投资（万元）
     */
    @Column("fixed_asset_investment", comment = "固定资产投资（万元）")
    var fixedAssetInvestment: Float? = null

    /**
     * 设备投资（万元）
     */
    @Column("equipment_investment", comment = "设备投资（万元）")
    var equipmentInvestment: Float? = null

    /**
     * 计划开工时间
     */
    @Column("planned_start_time", comment = "计划开工时间")
    var plannedStartTime: LocalDate? = null

    /**
     * 计划竣工时间
     */
    @Column("planned_end_time", comment = "计划竣工时间")
    var plannedEndTime: LocalDate? = null

    /**
     * 项目使用主要原、辅材料
     */
    @Column("main_raw_materials_used", comment = "项目使用主要原、辅材料")
    var mainRawMaterialsUsed: String? = null

    /**
     * 主要流程工艺
     */
    @Column("main_process_technology", comment = "主要流程工艺")
    var mainProcessTechnology: String? = null

    /**
     * 是否为新供地项目
     */
    @Column("is_new_supply_land_project", comment = "是否为新供地项目")
    var isNewSupplyLandProject: Boolean? = null

    /**
     * 申请用地面积（亩）
     */
    @Column("applied_land_area", comment = "申请用地面积（亩）")
    var appliedLandArea: Float? = null

    /**
     * 行业是否属于高新技术产业分类目录
     */
    @Column("is_high_tech_industry", comment = "行业是否属于高新技术产业分类目录")
    var isHighTechIndustry: Boolean? = null

    /**
     * 是否为高技术项目
     */
    @Column("is_high_tech_project", comment = "是否为高技术项目")
    var isHighTechProject: Boolean? = null

    /**
     * 是否为国家工业战略性新兴产业
     */
    @Column("is_national_strategic_emerging_industry", comment = "是否为国家工业战略性新兴产业")
    var isNationalStrategicEmergingIndustry: Boolean? = null

    /**
     * 容积率（%）
     */
    @Column("plot_ratio_percent", comment = "容积率（%）")
    var plotRatioPercent: Float? = null

    /**
     * 预期开票销售（万元）
     */
    @Column("expected_invoice_sales", comment = "预期开票销售（万元）")
    var expectedInvoiceSales: Float? = null

    /**
     * 预期税收（万元）
     */
    @Column("expected_tax", comment = "预期税收（万元）")
    var expectedTax: Float? = null

    /**
     * 预期用工人数（人）
     */
    @Column("expected_employee_count", comment = "预期用工人数（人）")
    var expectedEmployeeCount: Int? = null

    /**
     * 固定资产投资占比（%）
     */
    @Column("fixed_asset_investment_percentage", comment = "固定资产投资占比（%）")
    var fixedAssetInvestmentPercentage: Float? = null

    /**
     * 投资强度（万元/千平方米）
     */
    @Column("investment_intensity", comment = "投资强度（万元/千平方米）")
    var investmentIntensity: String? = null

    /**
     * 预期亩均税收（万元/千平方米）
     */
    @Column("expected_average_tax", comment = "预期亩均税收（万元/千平方米）")
    var expectedAverageTax: Float? = null

    /**
     * 是否有产生废水和挥发性有机废水排放
     */
    @Column("wastewater_by1", comment = "是否有产生废水和挥发性有机废水排放")
    var wastewaterBy1: String? = null

    /**
     * 产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂
     */
    @Column("wastewater_by2", comment = "产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂")
    var wastewaterBy2: Boolean? = null

    /**
     * 总能耗
     */
    @Column("total_energy_consumption", comment = "总能耗")
    var totalEnergyConsumption: String? = null

    /**
     * 项目是否含有研发团队、产学研合作及研发机构建设内容
     */
    @Column("has_rnd_team_and_cooperation", comment = "项目是否含有研发团队、产学研合作及研发机构建设内容")
    var hasRndTeamAndCooperation: Boolean? = null

    /**
     * 项目是否拥有相关有效发明专利
     */
    @Column("has_valid_patents", comment = "项目是否拥有相关有效发明专利")
    var hasValidPatents: Boolean? = null

    /**
     * 是否拟列入重点活动签约项目库
     */
    @Column("is_listed_as_key_activity_signing_project", comment = "是否拟列入重点活动签约项目库")
    var isListedAsKeyActivitySigningProject: Boolean? = null

    /**
     * 备注
     */
    @Column("remarks", comment = "备注")
    var remarks: String? = null

    /**
     * 协议利用外资（万美元）
     */
    @Column("agreement_foreign_direct_investment", comment = "协议利用外资（万美元）")
    var agreementForeignDirectInvestment: Float? = null

    /**
     * 招商项目ID
     */
    @Column("invest_online_id", comment = "招商项目ID")
    var investOnlineId: String? = null

    /**
     * 项目来源
     */
    @Column("source", comment = "项目来源")
    var source: String? = null

    /**
     * 市级机关名称
     */
    @Column("sjjg_name", comment = "市级机关名称")
    var sjjgName: String? = null

    /**
     * 是否需要质量评估
     */
    @Column("is_quality_evaluation", comment = "是否需要质量评估")
    var isQualityEvaluation: Boolean? = null

    /**
     * 是否需要项目审核
     */
    @Column("is_project_review", comment = "是否需要项目审核")
    var isProjectReview: Boolean? = null

    /**
     * 是否完成项目审核
     */
    @Column("is_project_review_complete", comment = "是否完成项目审核")
    var isProjectReviewComplete: Boolean? = null

    /**
     * 质态评估是否完成
     */
    @Column("is_quality_evaluation_complete", comment = "质态评估是否完成")
    var isQualityEvaluationComplete: Boolean? = null

    /**
     * 是否开工申请
     */
    @Column("is_start_approval", comment = "是否开工申请")
    var isStartApproval: Boolean? = null

    /**
     * 是否竣工审批
     */
    @Column("is_completion_approval", comment = "是否竣工审批")
    var isCompletionApproval: Boolean? = null

    /**
     * 0&#61;待审核 1&#61;市级审核通过 2&#61;市区审核通过 3&#61;审核不通过 4&#61;保存未提交
     */
    @Column(
        "check_status",
        comment = "0&#61;待审核 1&#61;市级审核通过 2&#61;市区审核通过 3&#61;审核不通过 4&#61;保存未提交"
    )
    var checkStatus: Short? = null

    /**
     * 建筑类型
     */
    @Column("building_type", comment = "建筑类型")
    var buildingType: String? = null

    /**
     * 使用面积
     */
    @Column("use_area", comment = "使用面积")
    var useArea: String? = null

    /**
     * 租赁面积
     */
    @Column("rent_area", comment = "租赁面积")
    var rentArea: String? = null

    /**
     * 购买面积
     */
    @Column("buy_area", comment = "购买面积")
    var buyArea: String? = null

    /**
     * 年度销量
     */
    @Column("year_xl", comment = "年度销量")
    var yearXl: String? = null

    /**
     * 年度税收
     */
    @Column("year_ss", comment = "年度税收")
    var yearSs: String? = null

    /**
     * 评估状态
     */
    @Column("pg_status", comment = "评估状态")
    var pgStatus: String? = null

    /**
     * 是否科创项目
     */
    @Column("is_kc_proj", comment = "是否科创项目")
    var isKcProj: String? = null

    /**
     * 科创项目条件
     */
    @Column("kc_proj_tj", comment = "科创项目条件")
    var kcProjTj: String? = null

    /**
     * 是否QFLP外资项目
     */
    @Column("is_qflp", comment = "是否QFLP外资项目")
    var isQflp: String? = null

    /**
     * 成效说明
     */
    @Column("cg_remark", comment = "成效说明")
    var cgRemark: String? = null

    /**
     * 是否特殊行业
     */
    @Column("tshy", comment = "是否特殊行业")
    var tshy: String? = null

    /**
     * 准入限制
     */
    @Column("zrxz", comment = "准入限制")
    var zrxz: String? = null

    /**
     * 是否两高项目
     */
    @Column("lgxm", comment = "是否两高项目")
    var lgxm: String? = null

    /**
     * 是否有重金属排放
     */
    @Column("zjspf", comment = "是否有重金属排放")
    var zjspf: String? = null

    /**
     * 产品市场现状
     */
    @Column("cpscxz", comment = "产品市场现状")
    var cpscxz: String? = null

    /**
     * 工艺水平
     */
    @Column("gysp", comment = "工艺水平")
    var gysp: String? = null

    /**
     * 生产效率
     */
    @Column("scxl", comment = "生产效率")
    var scxl: String? = null

    /**
     * 良品率
     */
    @Column("lpl", comment = "良品率")
    var lpl: String? = null

    /**
     * 是否高新技术企业
     */
    @Column("is_gxjs", comment = "是否高新技术企业")
    var ifGxjs: String? = null

    /**
     * 是否建立研发中心
     */
    @Column("is_build_yfzx", comment = "是否建立研发中心")
    var ifBuildYfzx: String? = null

    /**
     * 研发中心名称
     */
    @Column("build_yfzx", comment = "研发中心名称")
    var buildYfzx: String? = null

    /**
     * 预期开票销售（万元）
     */
    @Column("yq_kpxs", comment = "预期开票销售（万元）")
    var yqKpxs: String? = null

    /**
     * 预期税收（万元）
     */
    @Column("yq_ss", comment = "预期税收（万元）")
    var yqSs: String? = null

    /**
     * 预期亩均税收（万元/亩）
     */
    @Column("yq_mjtax", comment = "预期亩均税收（万元/亩）")
    var yqMjtax: String? = null

    /**
     * 预期产值
     */
    @Column("yq_cz", comment = "预期产值")
    var yqCz: String? = null

    /**
     * 认定进度
     */
    @Column("r_progress", comment = "认定进度")
    var rProgress: String? = null

    /**
     * 换算后签约金额
     */
    @Column("qyje", comment = "签约金额")
    var qyje: Double? = null

    /**
     * 产业关联度
     */
    @Column("cy_gl", comment = "产业关联度")
    var cyGl: String? = null

    /**
     * 是否有融资需求
     */
    @Column("is_rzxq", comment = "是否有融资需求")
    var isRzxq: String? = null

    /**
     * 融资金额
     */
    @Column("rz_money", comment = "融资金额")
    var rzMoney: String? = null

    /**
     * 初次接洽时间
     */
    @Column("first_time", comment = "初次接洽时间")
    var firstTime: String? = null

    /**
     * 租赁厂房面积
     */
    @Column("zl_land_area", comment = "租赁厂房面积")
    var zlLandArea: String? = null

    /**
     * 租赁厂房面积折算
     */
    @Column("zl_land_area_zs", comment = "租赁厂房面积折算")
    var zlLandAreaZs: String? = null

    /**
     * 项目是否列统
     */
    @Column("is_lt", comment = "项目是否列统 ")
    var isLt: Boolean? = null

    /**
     * 统计编码
     */
    @Column("lt_code", comment = "统计编码")
    var ltCode: String? = null

    @Column("investor_place", comment = "投资方注册地")
    var investorPlace: String? = null

    @Column("city_name", comment = "城市名称")
    var cityName: String? = null

    @Column("if_out_city", comment = "是否有市外资金投入")
    var ifOutCity: Boolean? = null

    @Column("share_ratio", comment = "股权比例")
    var shareRatio: String? = null

    @Column("ygmj", comment = "供面积")
    var ygmj: String? = null


    @Column("phmj", comment = "盘活面积")
    var phmj: String? = null

    @Column("tzgm", comment = "年度投资额(万元)")
    var tzgm: Float? = null

    @Column("is_zzkc", comment = "是否增资扩产")
    var isZzkc: Boolean? = null
}
