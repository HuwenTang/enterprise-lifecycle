@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("project_dcdx_economic_performance_stats", comment = "达产达效-产出效益表")
class ProjectDcdxEconomicPerformanceStats() : BaseModel<ProjectDcdxEconomicPerformanceStats>() {
    constructor(init: ProjectDcdxEconomicPerformanceStats.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市区名称
     */
    @Column("district", comment = "市区名称")
    var district: String? = null

    /**
     * 园区名称
     */
    @Column("park", comment = "园区名称")
    var park: String? = null

    /**
     * 年份
     */
    @Column("year", comment = "年份")
    var year: Int? = null

    /**
     * 产值 - 实绩（万元）
     */
    @Column("output_actual", comment = "产值 - 实绩（万元）")
    var outputActual: BigDecimal? = null

    /**
     * 产值增长贡献 &#61; (项目形成产值 / 全市规上工业产值增量) * 100%（百分比，单位：%）
     */
    @Column(
        "output_growth_contribution",
        comment = "产值增长贡献 &#61; (项目形成产值 / 全市规上工业产值增量) * 100%（百分比，单位：%）"
    )
    var outputGrowthContribution: BigDecimal? = null

    /**
     * 开票 - 实绩（万元）
     */
    @Column("invoice_actual", comment = "开票 - 实绩（万元）")
    var invoiceActual: BigDecimal? = null

    /**
     * 开票 - 预期（万元）
     */
    @Column("invoice_expected", comment = "开票 - 预期（万元）")
    var invoiceExpected: BigDecimal? = null

    /**
     * 开票达效率 &#61; (开票实绩 / 预期开票) * 100%（小数形式）
     */
    @Column("invoice_efficiency_rate", comment = "开票达效率 &#61; (开票实绩 / 预期开票) * 100%（小数形式）")
    var invoiceEfficiencyRate: BigDecimal? = null

    /**
     * 营收（万元）
     */
    @Column("revenue", comment = "营收（万元）")
    var revenue: BigDecimal? = null

    /**
     * 利润（万元）
     */
    @Column("profit", comment = "利润（万元）")
    var profit: BigDecimal? = null

    /**
     * 利润率 &#61; (利润 / 营业收入) * 100%（小数形式）
     */
    @Column("profit_margin", comment = "利润率 &#61; (利润 / 营业收入) * 100%（小数形式）")
    var profitMargin: BigDecimal? = null

    /**
     * 税收 - 实绩（万元）
     */
    @Column("tax_actual", comment = "税收 - 实绩（万元）")
    var taxActual: BigDecimal? = null

    /**
     * 税收 - 预期（万元）
     */
    @Column("tax_expected", comment = "税收 - 预期（万元）")
    var taxExpected: BigDecimal? = null

    /**
     * 税收达效率 &#61; (税收实绩 / 税收预期) * 100%（小数形式）
     */
    @Column("tax_efficiency_rate", comment = "税收达效率 &#61; (税收实绩 / 税收预期) * 100%（小数形式）")
    var taxEfficiencyRate: BigDecimal? = null

    /**
     * 所属产业链群，如：新能源、生物医药、高端装备等
     */
    @Column("industrial_chain_cluster", comment = "所属产业链群，如：新能源、生物医药、高端装备等")
    var industrialChainCluster: String? = null

    /**
     * 是否产业链群
     */
    @Column("is_lq", comment = "是否产业链群")
    var isLq: Boolean? = null
}
