package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.alibaba.fastjson2.parseArray
import com.tzdig.framework.file.annotation.JsonS3Transforming
import com.tzdig.framework.file.annotation.S3Transformable
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.mybatis.entity.prime.UserFeedbackComment
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class UserFeedbackCommentVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String,
    @get:Schema(description = "评论时间")
    @ExcelProperty("评论时间")
    val createTime: LocalDateTime,
    @get:Schema(description = "反馈ID")
    @ExcelProperty("反馈ID")
    val feedbackId: String,
    @get:Schema(description = "用户ID")
    @ExcelProperty("用户ID")
    val userid: String,
    @get:Schema(description = "用户姓名")
    @ExcelProperty("用户姓名")
    var userName: String? = null,
    @get:Schema(description = "回复ID")
    @ExcelProperty("回复ID")
    val replyToId: String?,
    @get:Schema(description = "意见内容")
    @ExcelProperty("意见内容")
    val content: String,
    @get:Schema(description = "图片")
    @ExcelProperty("图片")
    @get:JsonS3Transforming
    val images: List<FileDownloadVO>,
) : S3Transformable {
    constructor(record: UserFeedbackComment) : this(
        id = record.id!!,
        createTime = record.createTime!!,
        feedbackId = record.feedbackId!!,
        userid = record.userid!!,
        replyToId = record.replyToId,
        content = record.content!!,
        images = record.images.parseArray<FileDownloadVO>(),
    )

    override fun s3transform(transform: (String) -> String) {
        images.forEach { it.path = transform(it.path) }
    }
}
