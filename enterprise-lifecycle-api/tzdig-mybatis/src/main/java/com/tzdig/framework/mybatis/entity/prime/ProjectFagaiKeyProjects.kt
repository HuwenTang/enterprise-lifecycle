@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal
import java.time.LocalDate

@Table("project_fagai_key_projects", comment = "市级重点项目全量信息表（含产业链、投资、建设、统计信息）")
class ProjectFagaiKeyProjects() : BaseModel<ProjectFagaiKeyProjects>() {
    constructor(init: ProjectFagaiKeyProjects.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市（区），如：靖江市、泰兴市等
     */
    @Column("district", comment = "市（区），如：靖江市、泰兴市等")
    var district: String? = null

    /**
     * 园区名称，如：靖江经济技术开发区
     */
    @Column("park", comment = "园区名称，如：靖江经济技术开发区")
    var park: String? = null

    /**
     * 8+13+x，如：生物医药
     */
    @Column("innovative_clusters_8_13_x", comment = "8+13+x，如：生物医药")
    var innovativeClusters813X: String? = null

    /**
     * 8个创新集群
     */
    @Column("innovative_cluster", comment = "8个创新集群")
    var innovativeCluster: String? = null

    /**
     * 13条产业链
     */
    @Column("industrial_chain", comment = "13条产业链")
    var industrialChain: String? = null

    /**
     * 项目类型: 1&#61;开工 2&#61;竣工
     */
    @Column("project_type", comment = "项目类型: 1&#61;开工 2&#61;竣工")
    var projectType: Int? = null

    /**
     * 投资主体（企业名称）
     */
    @Column("investment_entity_and_name", comment = "投资主体（企业名称）")
    var investmentEntityAndName: String? = null

    /**
     * 是否为市级重点项目
     */
    @Column("is_municipal_key", comment = "是否为市级重点项目")
    var isMunicipalKey: Boolean? = null

    /**
     * 是否为省级重点项目
     */
    @Column("is_provience_key", comment = "是否为省级重点项目")
    var isProvienceKey: Boolean? = null

    /**
     * 是否为亿元以上项目
     */
    @Column("is_over_one_billion", comment = "是否为亿元以上项目")
    var isOverOneBillion: Boolean? = null

    /**
     * 是否为十亿元以上项目
     */
    @Column("is_over_ten_billion", comment = "是否为十亿元以上项目")
    var isOverTenBillion: Boolean? = null

    /**
     * 是否为外资项目
     */
    @Column("is_out", comment = "是否为外资项目")
    var isOut: Boolean? = null

    /**
     * 统一社会信用代码（18位）
     */
    @Column("uscc", comment = "统一社会信用代码（18位）")
    var uscc: String? = null

    /**
     * 统计库项目编码
     */
    @Column("statistical_project_code", comment = "统计库项目编码")
    var statisticalProjectCode: String? = null

    /**
     * 统计库中登记的项目名称
     */
    @Column("statistical_project_name", comment = "统计库中登记的项目名称")
    var statisticalProjectName: String? = null

    /**
     * 是否在建（根据实际判断）
     */
    @Column("is_under_construction", comment = "是否在建（根据实际判断）")
    var isUnderConstruction: Boolean? = null

    /**
     * 建设规模及主要内容
     */
    @Column("construction_scale", comment = "建设规模及主要内容")
    var constructionScale: String? = null

    /**
     * 建设性质：新建、扩建、租赁、技改等
     */
    @Column("construction_nature", comment = "建设性质：新建、扩建、租赁、技改等")
    var constructionNature: String? = null

    /**
     * 实际开工时间（格式：YYYY-MM-DD）
     */
    @Column("start_date", comment = "实际开工时间（格式：YYYY-MM-DD）")
    var startDate: LocalDate? = null

    /**
     * 实际竣工时间（格式：YYYY-MM-DD）
     */
    @Column("completion_date", comment = "实际竣工时间（格式：YYYY-MM-DD）")
    var completionDate: LocalDate? = null

    /**
     * 计划总投资（内资+外资）（万元）
     */
    @Column("planned_total_investment_all", comment = "计划总投资（内资+外资）（万元）")
    var plannedTotalInvestmentAll: BigDecimal? = null

    /**
     * 计划总投资 - 内资（万元）
     */
    @Column("planned_total_investment_domestic", comment = "计划总投资 - 内资（万元）")
    var plannedTotalInvestmentDomestic: BigDecimal? = null

    /**
     * 计划总投资 - 外资（万元）
     */
    @Column("planned_total_investment_foreign", comment = "计划总投资 - 外资（万元）")
    var plannedTotalInvestmentForeign: BigDecimal? = null

    /**
     * 项目实际投资（内资+外资）（万元）
     */
    @Column("actual_total_investment_all", comment = "项目实际投资（内资+外资）（万元）")
    var actualTotalInvestmentAll: BigDecimal? = null

    /**
     * 项目实际投资内资（万元）
     */
    @Column("actual_total_investment_domestic", comment = "项目实际投资内资（万元）")
    var actualTotalInvestmentDomestic: BigDecimal? = null

    /**
     * 项目实际投资-外资（万元）
     */
    @Column("actual_total_investment_foreign", comment = "项目实际投资-外资（万元）")
    var actualTotalInvestmentForeign: BigDecimal? = null

    /**
     * 年度计划投资（万元）
     */
    @Column("annual_planned_investment", comment = "年度计划投资（万元）")
    var annualPlannedInvestment: BigDecimal? = null

    /**
     * 项目在库计划总投资（万元）
     */
    @Column("statistical_total_investment", comment = "项目在库计划总投资（万元）")
    var statisticalTotalInvestment: BigDecimal? = null

    /**
     * 项目列统投资累计列统投资(万元)
     */
    @Column("statistical_actual_total_investment", comment = "项目列统投资累计列统投资(万元)")
    var statisticalActualTotalInvestment: BigDecimal? = null

    /**
     * 项目代码（备案证号）
     */
    @Column("project_record_code", comment = "项目代码（备案证号）")
    var projectRecordCode: String? = null
}
