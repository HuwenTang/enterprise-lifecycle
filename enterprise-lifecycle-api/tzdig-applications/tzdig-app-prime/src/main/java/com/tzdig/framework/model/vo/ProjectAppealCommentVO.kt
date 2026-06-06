@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectAppealComment
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class ProjectAppealCommentVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String,
    @get:Schema(description = "评论时间")
    @ExcelProperty("评论时间")
    val createTime: LocalDateTime,
    @get:Schema(description = "申诉ID")
    @ExcelProperty("申诉ID")
    val appealId: String,
    @get:Schema(description = "用户姓名")
    @ExcelProperty("用户姓名")
    var userName: String = "",
    @get:Schema(description = "回复ID")
    @ExcelProperty("回复ID")
    val replyToId: String?,
    @get:Schema(description = "意见内容")
    @ExcelProperty("意见内容")
    val content: String,
) {
    constructor(record: ProjectAppealComment) : this(
        id = record.id!!,
        createTime = record.createTime!!,
        appealId = record.appealId!!,
        replyToId = record.replyToId,
        content = record.content!!,
    )
}
