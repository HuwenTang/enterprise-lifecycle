@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal
import java.time.LocalDate

@Table("project_info_fg", comment = "发改项目管理表")
class ProjectInfoFg() : BaseModel<ProjectInfoFg>() {
    constructor(init: ProjectInfoFg.() -> Unit) : this() {
        this.init()
    }

    /**
     * 发改项目名称
     */
    @Column("fg_project_name", comment = "发改项目名称")
    var fgProjectName: String? = null

    /**
     * 全生命项目名称
     */
    @Column("full_lifecycle_project_name", comment = "全生命项目名称")
    var fullLifecycleProjectName: String? = null

    /**
     * 项目来源
     */
    @Column("project_source", comment = "项目来源")
    var projectSource: String? = null

    /**
     * 项目代码
     */
    @Column("project_code", comment = "项目代码")
    var projectCode: String? = null

    /**
     * 备案证项目代码
     */
    @Column("filing_project_code", comment = "备案证项目代码")
    var filingProjectCode: String? = null

    /**
     * 申请备案时间
     */
    @Column("filing_application_time", comment = "申请备案时间")
    var filingApplicationTime: LocalDate? = null

    /**
     * 建设规模
     */
    @Column("construction_scale", comment = "建设规模")
    var constructionScale: String? = null

    /**
     * 建设起止年限
     */
    @Column("construction_start_end_years", comment = "建设起止年限")
    var constructionStartEndYears: String? = null

    /**
     * 计划总投资(含单位)
     */
    @Column("planned_total_investment", comment = "计划总投资(含单位)")
    var plannedTotalInvestment: String? = null

    /**
     * 计划总投资(数值)
     */
    @Column("planned_total_investment_value", comment = "计划总投资(数值)")
    var plannedTotalInvestmentValue: BigDecimal? = null

    /**
     * 从开工到2025年底预计完成投资
     */
    @Column("expected_completed_investment_to_2025", comment = "从开工到2025年底预计完成投资")
    var expectedCompletedInvestmentTo2025: BigDecimal? = null

    /**
     * 2026年计划投资(含单位)
     */
    @Column("planned_investment_2026", comment = "2026年计划投资(含单位)")
    var plannedInvestment2026: String? = null

    /**
     * 2026年计划投资(数值)
     */
    @Column("planned_investment_2026_value", comment = "2026年计划投资(数值)")
    var plannedInvestment2026Value: BigDecimal? = null

    /**
     * 截至2025年底建设进度或前期工作进展情况
     */
    @Column("progress_to_end_2025", comment = "截至2025年底建设进度或前期工作进展情况")
    var progressToEnd2025: String? = null

    /**
     * 2026年建设进度
     */
    @Column("construction_progress_2026", comment = "2026年建设进度")
    var constructionProgress2026: String? = null

    /**
     * 是否新开工
     */
    @Column("is_new_start", comment = "是否新开工")
    var isNewStart: String? = null

    /**
     * (预计)开工时间
     */
    @Column("expected_start_time", comment = "(预计)开工时间")
    var expectedStartTime: LocalDate? = null

    /**
     * (预计)首次达产时间
     */
    @Column("expected_first_production_time", comment = "(预计)首次达产时间")
    var expectedFirstProductionTime: LocalDate? = null

    /**
     * 投资主体名称
     */
    @Column("investment_entity_name", comment = "投资主体名称")
    var investmentEntityName: String? = null

    /**
     * 服务推进责任单位
     */
    @Column("responsible_unit", comment = "服务推进责任单位")
    var responsibleUnit: String? = null

    /**
     * 项目所在园区、乡镇/街道
     */
    @Column("project_location", comment = "项目所在园区、乡镇/街道")
    var projectLocation: String? = null

    /**
     * 投资性质
     */
    @Column("investment_nature", comment = "投资性质")
    var investmentNature: String? = null
}
