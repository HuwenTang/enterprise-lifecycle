@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal
import java.time.LocalDate

@Table("project_completed_info", comment = "竣工项目总表")
class ProjectCompletedInfo() : BaseModel<ProjectCompletedInfo>() {
    constructor(init: ProjectCompletedInfo.() -> Unit) : this() {
        this.init()
    }

    /**
     * 建表语句所属年份
     */
    @Column("year_of_table", comment = "建表语句所属年份")
    var year: Int? = null

    /**
     * 工业十大行业分类
     */
    @Column("classification", comment = "工业十大行业分类")
    var classification: String? = null

    /**
     * 8个创新型集群
     */
    @Column("cluster", comment = "8个创新型集群")
    var cluster: String? = null

    /**
     * 13条产业链
     */
    @Column("industry", comment = "13条产业链")
    var industry: String? = null

    /**
     * 所属板块
     */
    @Column("sector", comment = "所属板块")
    var sector: String? = null

    /**
     * 所属园区
     */
    @Column("park", comment = "所属园区")
    var park: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 重点项目
     */
    @Column("key_project", comment = "重点项目")
    var keyProject: String? = null

    /**
     * 成立时间
     */
    @Column("establishment_time", comment = "成立时间")
    var establishmentTime: LocalDate? = null

    /**
     * 公司名称
     */
    @Column("company_name", comment = "公司名称")
    var companyName: String? = null

    /**
     * 招商内项目名称
     */
    @Column("invest_online_id", comment = "招商内项目名称")
    var investOnlineId: String? = null

    /**
     * 统一信用代码
     */
    @Column("unified_credit_code", comment = "统一信用代码")
    var unifiedCreditCode: String? = null

    /**
     * 新建/存量
     */
    @Column("new_or_history", comment = "新建/存量")
    var newOrHistory: String? = null

    /**
     * 是否规上企业
     */
    @Column("is_up_enterprise", comment = "是否规上企业")
    var isUpEnterprise: String? = null

    /**
     * 项目编码
     */
    @Column("project_code", comment = "项目编码")
    var projectCode: String? = null

    /**
     * 建设规模及主要内容
     */
    @Column("construction_scale_and_main_content", comment = "建设规模及主要内容")
    var constructionScaleAndMainContent: String? = null

    /**
     * 建设性质
     */
    @Column("construction_nature", comment = "建设性质")
    var constructionNature: String? = null

    /**
     * 开工时间
     */
    @Column("commencement_time", comment = "开工时间")
    var commencementTime: LocalDate? = null

    /**
     * 竣工时间
     */
    @Column("completion_time", comment = "竣工时间")
    var completionTime: LocalDate? = null

    /**
     * 计划总投资内资
     */
    @Column("planned_total_investment_domestic", comment = "计划总投资内资")
    var plannedTotalInvestmentDomestic: BigDecimal? = null

    /**
     * 计划总投资外资
     */
    @Column("planned_total_investment_foreign", comment = "计划总投资外资")
    var plannedTotalInvestmentForeign: BigDecimal? = null

    /**
     * 实际完成投资内资
     */
    @Column("actual_completion_investment_domestic", comment = "实际完成投资内资")
    var actualCompletionInvestmentDomestic: BigDecimal? = null

    /**
     * 实际完成投资外资
     */
    @Column("actual_completion_investment_foreign", comment = "实际完成投资外资")
    var actualCompletionInvestmentForeign: BigDecimal? = null

    /**
     * 行业分类
     */
    @Column("industry_classification", comment = "行业分类")
    var industryClassification: String? = null

    /**
     * 计划固定资产投资
     */
    @Column("planned_fixed_asset_investment", comment = "计划固定资产投资")
    var plannedFixedAssetInvestment: BigDecimal? = null

    /**
     * 实际固定资产投资
     */
    @Column("actual_fixed_asset_investment", comment = "实际固定资产投资")
    var actualFixedAssetInvestment: BigDecimal? = null

    /**
     * 固定资产投资占比
     */
    @Column("fixed_asset_investment_ratio", comment = "固定资产投资占比")
    var fixedAssetInvestmentRatio: BigDecimal? = null

    /**
     * 拟用地面积（亩）
     */
    @Column("proposed_land_area", comment = "拟用地面积（亩）")
    var proposedLandArea: BigDecimal? = null

    /**
     * 实际用地面积（亩）
     */
    @Column("actual_land_area", comment = "实际用地面积（亩）")
    var actualLandArea: BigDecimal? = null

    /**
     * 拟租厂房面积（平方米）
     */
    @Column("proposed_rental_factory_area", comment = "拟租厂房面积（平方米）")
    var proposedRentalFactoryArea: BigDecimal? = null

    /**
     * 实际租厂房面积（平方米）
     */
    @Column("actual_rental_factory_area", comment = "实际租厂房面积（平方米）")
    var actualRentalFactoryArea: BigDecimal? = null

    /**
     * 拟购厂房面积（平方米）
     */
    @Column("proposed_purchase_factory_area", comment = "拟购厂房面积（平方米）")
    var proposedPurchaseFactoryArea: BigDecimal? = null

    /**
     * 实际购厂房面积（平方米）
     */
    @Column("actual_purchase_factory_area", comment = "实际购厂房面积（平方米）")
    var actualPurchaseFactoryArea: BigDecimal? = null

    /**
     * 预期用工人数（人）
     */
    @Column("expected_employment_numbers", comment = "预期用工人数（人）")
    var expectedEmploymentNumbers: Int? = null

    /**
     * 实际用工人数（人）
     */
    @Column("actual_employment_numbers", comment = "实际用工人数（人）")
    var actualEmploymentNumbers: Int? = null

    /**
     * 预计新增经济效益-销售
     */
    @Column("expected_new_economic_benefits_sales", comment = "预计新增经济效益-销售")
    var expectedNewEconomicBenefitsSales: BigDecimal? = null

    /**
     * 实际新增经济效益-销售
     */
    @Column("actual_new_economic_benefits_sales", comment = "实际新增经济效益-销售")
    var actualNewEconomicBenefitsSales: BigDecimal? = null

    /**
     * 预计新增经济效益-利润
     */
    @Column("expected_new_economic_benefits_profit", comment = "预计新增经济效益-利润")
    var expectedNewEconomicBenefitsProfit: BigDecimal? = null

    /**
     * 实际新增经济效益-利润
     */
    @Column("actual_new_economic_benefits_profit", comment = "实际新增经济效益-利润")
    var actualNewEconomicBenefitsProfit: BigDecimal? = null

    /**
     * 预计新增经济效益-税金
     */
    @Column("expected_new_economic_benefits_tax", comment = "预计新增经济效益-税金")
    var expectedNewEconomicBenefitsTax: BigDecimal? = null

    /**
     * 实际新增经济效益-税金
     */
    @Column("actual_new_economic_benefits_tax", comment = "实际新增经济效益-税金")
    var actualNewEconomicBenefitsTax: BigDecimal? = null

    /**
     * 亩均税收（万元/千平方米）
     */
    @Column("tax_per_mu", comment = "亩均税收（万元/千平方米）")
    var taxPerMu: BigDecimal? = null

    /**
     * 计划进归时间
     */
    @Column("planned_entry_time", comment = "计划进归时间")
    var plannedEntryTime: LocalDate? = null

    /**
     * 实际进归时间
     */
    @Column("actual_entry_time", comment = "实际进归时间")
    var actualEntryTime: LocalDate? = null

    /**
     * 是否工业项目
     */
    @Column("is_industry_project", comment = "是否工业项目")
    var isIndustryProject: Boolean? = null
}
