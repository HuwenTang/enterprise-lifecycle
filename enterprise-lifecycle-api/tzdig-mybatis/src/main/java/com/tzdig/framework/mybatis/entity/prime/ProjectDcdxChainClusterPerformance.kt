@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("project_dcdx_chain_cluster_performance", comment = "达产达效-“8+13+X”链群体系个性化数据统计表")
class ProjectDcdxChainClusterPerformance() : BaseModel<ProjectDcdxChainClusterPerformance>() {
    constructor(init: ProjectDcdxChainClusterPerformance.() -> Unit) : this() {
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
     * 所属产业链群，如：新能源、生物医药、高端装备等
     */
    @Column("industrial_chain_cluster", comment = "所属产业链群，如：新能源、生物医药、高端装备等")
    var industrialChainCluster: String? = null

    /**
     * 产业链群合计产值（亿元）
     */
    @Column("cluster_total_output", comment = "产业链群合计产值（亿元）")
    var clusterTotalOutput: BigDecimal? = null

    /**
     * 同比增长（%），小数形式（如 0.1234 表示 12.34%）
     */
    @Column("year_on_year_growth", comment = "同比增长（%），小数形式（如 0.1234 表示 12.34%）")
    var yearOnYearGrowth: BigDecimal? = null

    /**
     * 全市规上工业产值（亿元）
     */
    @Column("city_scale_industrial_output", comment = "全市规上工业产值（亿元）")
    var cityScaleIndustrialOutput: BigDecimal? = null

    /**
     * 占全市规上工业比重（%），小数形式
     */
    @Column("share_of_city_industry", comment = "占全市规上工业比重（%），小数形式")
    var shareOfCityIndustry: BigDecimal? = null

    /**
     * 对规上工业产值增长的贡献率（%），小数形式
     */
    @Column("contribution_to_growth", comment = "对规上工业产值增长的贡献率（%），小数形式")
    var contributionToGrowth: BigDecimal? = null

    /**
     * 是否产业链群
     */
    @Column("is_lq", comment = "是否产业链群")
    var isLq: Boolean? = null
}
