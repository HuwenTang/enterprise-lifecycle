@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal
import java.time.LocalDate

@Table("project_important_province_info")
class ProjectImportantProvinceInfo() : BaseModel<ProjectImportantProvinceInfo>() {
    constructor(init: ProjectImportantProvinceInfo.() -> Unit) : this() {
        this.init()
    }

    /**
     * 年份
     */
    @Column("year", comment = "年份")
    var year: Int? = null

    /**
     * 级别（如：省、市）
     */
    @Column("level", comment = "级别（如：省、市）")
    var level: String? = null

    /**
     * 企业名称
     */
    @Column("company_name", comment = "企业名称")
    var companyName: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 项目建设内容和规模
     */
    @Column("construction_content_and_scale", comment = "项目建设内容和规模")
    var constructionContentAndScale: String? = null

    /**
     * 所属板块
     */
    @Column("sector", comment = "所属板块")
    var sector: String? = null

    /**
     * 项目融资需求（万元）
     */
    @Column("financing_demand", comment = "项目融资需求（万元）")
    var financingDemand: BigDecimal? = null

    /**
     * 到202X-1年底累计完成投资（万元）
     */
    @Column("cumulative_investment_to_prev_year", comment = "到202X-1年底累计完成投资（万元）")
    var cumulativeInvestmentToPrevYear: BigDecimal? = null

    /**
     * 202X年计划投资（万元）
     */
    @Column("planned_investment_current_year", comment = "202X年计划投资（万元）")
    var plannedInvestmentCurrentYear: BigDecimal? = null

    /**
     * 预计新增经济效益-销售（万元）
     */
    @Column("expected_sales", comment = "预计新增经济效益-销售（万元）")
    var expectedSales: BigDecimal? = null

    /**
     * 预计新增经济效益-利润（万元）
     */
    @Column("expected_profit", comment = "预计新增经济效益-利润（万元）")
    var expectedProfit: BigDecimal? = null

    /**
     * 预计新增经济效益-税金（万元）
     */
    @Column("expected_tax", comment = "预计新增经济效益-税金（万元）")
    var expectedTax: BigDecimal? = null

    /**
     * 项目起止年月（起），示例：2022年1月
     */
    @Column("start_date", comment = "项目起止年月（起），示例：2022年1月")
    var startDate: LocalDate? = null

    /**
     * 项目起止年月（止），示例：2024年12月
     */
    @Column("end_date", comment = "项目起止年月（止），示例：2024年12月")
    var endDate: LocalDate? = null

    /**
     * 项目所属园区
     */
    @Column("park", comment = "项目所属园区")
    var park: String? = null

    /**
     * 项目阶段（如：续建结转下年）
     */
    @Column("project_stage", comment = "项目阶段（如：续建结转下年）")
    var projectStage: String? = null

    /**
     * 当年完成投资（万元）
     */
    @Column("investment_completed_current_year", comment = "当年完成投资（万元）")
    var investmentCompletedCurrentYear: BigDecimal? = null

    /**
     * 项目形象进度
     */
    @Column("project_progress", comment = "项目形象进度")
    var projectProgress: String? = null

    /**
     * 行业分类
     */
    @Column("industry_classification", comment = "行业分类")
    var industryClassification: String? = null
}
