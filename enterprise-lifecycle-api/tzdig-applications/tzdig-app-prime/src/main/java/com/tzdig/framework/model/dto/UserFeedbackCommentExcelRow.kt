package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.UserFeedbackComment

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class UserFeedbackCommentExcelRow(
    @field:ExcelProperty("反馈ID")
    var feedbackId: String? = null,
    @field:ExcelProperty("用户ID")
    var userid: String? = null,
    @field:ExcelProperty("回复ID")
    var replyToId: String? = null,
    @field:ExcelProperty("意见内容")
    var content: String? = null,
    @field:ExcelProperty("图片")
    var images: String? = null,
) : ExcelRow<UserFeedbackCommentExcelRow>() {
    fun toUserFeedbackComment(): UserFeedbackComment =
        UserFeedbackComment {
            into(this)
        }

    fun into(record: UserFeedbackComment): UserFeedbackComment {
        record.feedbackId = feedbackId
        record.userid = userid
        record.replyToId = replyToId
        record.content = content
        record.images = images
        return record
    }
}
