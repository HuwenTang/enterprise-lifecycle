@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("project_fagai_key_projects_stats", comment = "开竣工—市级重点项目统计表")
class ProjectFagaiKeyProjectsStats() : BaseModel<ProjectFagaiKeyProjectsStats>() {
    constructor(init: ProjectFagaiKeyProjectsStats.() -> Unit) : this() {
        this.init()
    }

    /**
     * 开工1、竣工2、在建3
     */
    @Column("status", comment = "开工1、竣工2、在建3")
    var status: Int? = null

    /**
     * 项目类型(市级重点1、亿元2、10亿元3、全部4)
     */
    @Column("type", comment = "项目类型(市级重点1、亿元2、10亿元3、全部4)")
    var type: Int? = null

    /**
     * 市区
     */
    @Column("city", comment = "市区")
    var city: String? = null

    /**
     * 园区名称，如：靖江市、高新区等
     */
    @Column("park", comment = "园区名称，如：靖江市、高新区等")
    var park: String? = null

    /**
     * 所属产业链群，如：新能源、生物医药等
     */
    @Column("industrial_chain_cluster", comment = "所属产业链群，如：新能源、生物医药等")
    var industrialChainCluster: String? = null

    /**
     * 市级重点项目总数
     */
    @Column("project_count_total", comment = "市级重点项目总数")
    var projectCountTotal: Int? = null

    /**
     * 其中：外资项目数量
     */
    @Column("project_count_foreign_investment", comment = "其中：外资项目数量")
    var projectCountForeignInvestment: Int? = null

    /**
     * 其中：内资项目数量
     */
    @Column("project_count_domestic_investment", comment = "其中：内资项目数量")
    var projectCountDomesticInvestment: Int? = null

    /**
     * 计划总投资总额（万元）
     */
    @Column("planned_investment_total", comment = "计划总投资总额（万元）")
    var plannedInvestmentTotal: BigDecimal? = null

    /**
     * 其中：外资项目计划总投资（万元）
     */
    @Column("planned_investment_foreign", comment = "其中：外资项目计划总投资（万元）")
    var plannedInvestmentForeign: BigDecimal? = null

    /**
     * 其中：内资项目计划总投资（万元）
     */
    @Column("planned_investment_domestic", comment = "其中：内资项目计划总投资（万元）")
    var plannedInvestmentDomestic: BigDecimal? = null

    /**
     * 其中：入库投资额
     */
    @Column("in_invest", comment = "其中：入库投资额")
    var inInvest: BigDecimal? = null

    /**
     * 投资完成率
     */
    @Column("ratio", comment = "投资完成率")
    var ratio: BigDecimal? = null
}
