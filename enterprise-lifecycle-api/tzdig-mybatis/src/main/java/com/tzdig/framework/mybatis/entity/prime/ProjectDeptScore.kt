@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_dept_score", comment = "三个大抓-部门得分")
class ProjectDeptScore() : BaseModel<ProjectDeptScore>() {
    constructor(init: ProjectDeptScore.() -> Unit) : this() {
        this.init()
    }

    /**
     * 部门名称
     */
    @Column("dept_name", comment = "部门名称")
    var deptName: String? = null

    /**
     * 部门id
     */
    @Column("dept_id", comment = "部门id")
    var deptId: String? = null

    /**
     * 部门分类
     */
    @Column("dept_class", comment = "部门分类")
    var deptClass: String? = null

    /**
     * 年度
     */
    @Column("year", comment = "年度")
    var year: Int? = null

    /**
     * 计分
     */
    @Column("score", comment = "计分")
    var score: Float? = null

    /**
     * 实际得分
     */
    @Column("actual_score", comment = "实际得分")
    var actualScore: Float? = null

    /**
     * 签约得分
     */
    @Column("sign_score", comment = "签约得分")
    var signScore: Float? = null

    /**
     * 实际签约得分
     */
    @Column("actual_sign_score", comment = "实际签约得分")
    var actualSignScore: Float? = null

    /**
     * 开工得分
     */
    @Column("start_score", comment = "开工得分")
    var startScore: Float? = null

    /**
     * 实际开工得分
     */
    @Column("actual_start_score", comment = "实际开工得分")
    var actualStartScore: Float? = null
}
