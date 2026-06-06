@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("user_feedback", comment = "问题反馈")
class UserFeedback() : BaseModel<UserFeedback>() {
    constructor(init: UserFeedback.() -> Unit) : this() {
        this.init()
    }

    /**
     * 反馈人手机号
     */
    @Column("user_mobile", comment = "反馈人手机号")
    var userMobile: String? = null

    /**
     * 反馈人用户ID
     */
    @Column("userid", comment = "反馈人用户ID")
    var userid: String? = null

    /**
     * 所属单位ID
     */
    @Column("org_id", comment = "所属单位ID")
    var orgId: String? = null

    /**
     * 反馈内容
     */
    @Column("content", comment = "反馈内容")
    var content: String? = null

    /**
     * 反馈图片
     */
    @Column("images", comment = "反馈图片")
    var images: String? = null

    /**
     * 问题分类
     */
    @Column("problem_category", comment = "问题分类")
    var problemCategory: Int? = null

    /**
     * 处理状态
     */
    @Column("status", comment = "处理状态")
    var status: Boolean? = null

    /**
     * 责任部门
     */
    @Column("operator", comment = "责任部门")
    var operator: String? = null

    /**
     * 处理结果
     */
    @Column("result", comment = "处理结果")
    var result: String? = null
}
