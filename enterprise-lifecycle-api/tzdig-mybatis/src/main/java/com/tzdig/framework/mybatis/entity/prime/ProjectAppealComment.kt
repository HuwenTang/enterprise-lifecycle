@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("project_appeal_comment", comment = "项目申诉意见")
class ProjectAppealComment() : BaseModel<ProjectAppealComment>() {
    constructor(init: ProjectAppealComment.() -> Unit) : this() {
        this.init()
    }

    /**
     * 申诉ID
     */
    @Column("appeal_id", comment = "申诉ID")
    var appealId: String? = null

    /**
     * 用户ID
     */
    @Column("userid", comment = "用户ID")
    var userid: String? = null

    /**
     * 回复ID
     */
    @Column("reply_to_id", comment = "回复ID")
    var replyToId: String? = null

    /**
     * 意见内容
     */
    @Column("content", comment = "意见内容")
    var content: String? = null
}
