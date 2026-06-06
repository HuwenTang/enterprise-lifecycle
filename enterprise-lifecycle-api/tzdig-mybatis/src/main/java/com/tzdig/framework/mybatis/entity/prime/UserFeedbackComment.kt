@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel

@Table("user_feedback_comment", comment = "问题反馈回复")
class UserFeedbackComment() : BaseModel<UserFeedbackComment>() {
    constructor(init: UserFeedbackComment.() -> Unit) : this() {
        this.init()
    }

    /**
     * 反馈ID
     */
    @Column("feedback_id", comment = "反馈ID")
    var feedbackId: String? = null

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

    /**
     * 图片
     */
    @Column("images", comment = "图片")
    var images: String? = null
}
