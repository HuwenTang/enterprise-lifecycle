@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_dcdx_enterprise_completion", comment = "达产达效-进规纳统企业表")
class ProjectDcdxEnterpriseCompletion() : BaseModel<ProjectDcdxEnterpriseCompletion>() {
    constructor(init: ProjectDcdxEnterpriseCompletion.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市（区）名称，如：泰州市、海陵区等
     */
    @Column("district", comment = "市（区）名称，如：泰州市、海陵区等")
    var district: String? = null

    /**
     * 年份
     */
    @Column("year", comment = "年份")
    var year: Int? = null

    /**
     * 企业名称
     */
    @Column("name", comment = "企业名称")
    var name: String? = null

    /**
     * 进规纳统企业
     */
    @Column("is_jg_enterprise", comment = "进规纳统企业")
    var isJgEnterprise: Boolean? = null

    /**
     * 预估进规纳统企业
     */
    @Column("is_ygjg_enterprise", comment = "预估进规纳统企业")
    var isYgjgEnterprise: Boolean? = null
}
