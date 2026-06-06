@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal

@Table("project_dcdx_completion_investment", comment = "达产达效-竣工项目及投资情况统计表")
class ProjectDcdxCompletionInvestment() : BaseModel<ProjectDcdxCompletionInvestment>() {
    constructor(init: ProjectDcdxCompletionInvestment.() -> Unit) : this() {
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
     * 竣工项目数
     */
    @Column("completed_project_count", comment = "竣工项目数")
    var completedProjectCount: Int? = null

    /**
     * 签约投资额（万元）
     */
    @Column("signed_investment", comment = "签约投资额（万元）")
    var signedInvestment: BigDecimal? = null

    /**
     * 完成投资额（万元）
     */
    @Column("completed_investment", comment = "完成投资额（万元）")
    var completedInvestment: BigDecimal? = null

    /**
     * 其中：固定资产投资（万元）
     */
    @Column("fixed_asset_investment", comment = "其中：固定资产投资（万元）")
    var fixedAssetInvestment: BigDecimal? = null

    /**
     * 设备投资（万元）
     */
    @Column("equipment_investment", comment = "设备投资（万元）")
    var equipmentInvestment: BigDecimal? = null

    /**
     * 投资完成比重（完成/签约，小数形式）
     */
    @Column("investment_completion_ratio", comment = "投资完成比重（完成/签约，小数形式）")
    var investmentCompletionRatio: BigDecimal? = null

    /**
     * 所属产业链群
     */
    @Column("industrial_chain_cluster", comment = "所属产业链群")
    var industrialChainCluster: String? = null

    /**
     * 是否产业链群
     */
    @Column("is_lq", comment = "是否产业链群")
    var isLq: Boolean? = null
}
