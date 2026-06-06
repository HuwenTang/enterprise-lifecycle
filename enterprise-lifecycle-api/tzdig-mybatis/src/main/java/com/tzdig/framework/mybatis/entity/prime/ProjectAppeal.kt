@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_appeal", comment = "项目申诉")
class ProjectAppeal() : BaseModel<ProjectAppeal>() {
    constructor(init: ProjectAppeal.() -> Unit) : this() {
        this.init()
    }

    /**
     * 招商ID
     */
    @Column("investment_id", comment = "招商ID")
    var investmentId: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 市级机关名称
     */
    @Column("sjjg_name", comment = "市级机关名称")
    var sjjgName: String? = null

    /**
     * 用户ID
     */
    @Column("userid", comment = "用户ID")
    var userid: String? = null

    /**
     * 问题描述
     */
    @Column("description", comment = "问题描述")
    var description: String? = null

    /**
     * 图片
     */
    @Column("images", comment = "图片")
    var images: String? = null

    /**
     * 状态 0&#61;待处理 1&#61;通过 2&#61;退回
     */
    @Column("status", comment = "状态 0&#61;待处理 1&#61;通过 2&#61;退回")
    var status: String? = null

    object Status {
        const val PENDING = "0"
        const val RESOLVED = "1"
        const val REJECT = "2"
    }
}
