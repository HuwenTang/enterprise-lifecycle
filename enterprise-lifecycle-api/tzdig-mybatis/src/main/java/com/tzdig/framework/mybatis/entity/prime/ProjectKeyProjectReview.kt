@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_key_project_review", comment = "重点项目信息表")
class ProjectKeyProjectReview() : BaseModel<ProjectKeyProjectReview>() {
    constructor(init: ProjectKeyProjectReview.() -> Unit) : this() {
        this.init()
    }

    /**
     * 重点项目id
     */
    @Column("key_project_id", comment = "重点项目id")
    var keyProjectId: String? = null

    /**
     * 完成状态
     */
    @Column("status", comment = "完成状态")
    var status: String? = null

    /**
     * 项目级别
     */
    @Column("key_project_level", comment = "项目级别")
    var keyProjectLevel: String? = null

    /**
     * 部门id
     */
    @Column("department_id", comment = "部门id")
    var departmentId: String? = null

    /**
     * 项目评价
     */
    @Column("comment", comment = "项目评价")
    var comment: String? = null
}
