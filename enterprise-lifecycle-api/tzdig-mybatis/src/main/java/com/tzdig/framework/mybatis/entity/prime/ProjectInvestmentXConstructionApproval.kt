@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_investment_x_construction_approval", comment = "招商项目绑定工改")
class ProjectInvestmentXConstructionApproval() : BaseModel<ProjectInvestmentXConstructionApproval>() {
    constructor(init: ProjectInvestmentXConstructionApproval.() -> Unit) : this() {
        this.init()
    }

    @Column(ignore = true)
    override var deleted: Boolean = false

    /**
     * 招商ID
     */
    @Column("investment_id", comment = "招商ID")
    var investmentId: String? = null

    /**
     * 工改ID
     */
    @Column("construction_approval_id", comment = "工改ID")
    var constructionApprovalId: String? = null

    /**
     * 非招商ID
     */
    @Column("non_investment_id", comment = "非招商ID")
    var nonInvestmentId: String? = null
}
