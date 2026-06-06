package com.tzdig.framework.model.dto

import com.alibaba.fastjson2.toJSONString
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.mybatis.entity.prime.UserFeedbackComment
import io.swagger.v3.oas.annotations.media.Schema

data class UserFeedbackCommentDTO(
    @param:Schema(description = "反馈ID")
    val feedbackId: String,
    @param:Schema(description = "回复ID")
    val replyToId: String?,
    @param:Schema(description = "意见内容")
    val content: String,
    @param:Schema(description = "图片")
    val images: List<FileDownloadVO>,
) {
    fun toUserFeedbackComment(userid: String): UserFeedbackComment =
        UserFeedbackComment {
            this.userid = userid
            into(this)
        }

    fun into(record: UserFeedbackComment): UserFeedbackComment {
        record.feedbackId = feedbackId
        record.replyToId = replyToId
        record.content = content
        record.images = images.toJSONString()
        return record
    }
}
