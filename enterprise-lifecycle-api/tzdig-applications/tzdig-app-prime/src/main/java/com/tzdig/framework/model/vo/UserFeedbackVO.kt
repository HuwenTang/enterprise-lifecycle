@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.file.annotation.S3Transformable
import com.tzdig.framework.mybatis.entity.prime.UserFeedback
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

data class UserFeedbackVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String,
    @get:Schema(description = "创建时间")
    @ExcelProperty("创建时间")
    val createTime: LocalDateTime,
    @get:Schema(description = "更新时间")
    @ExcelProperty("更新时间")
    val updateTime: LocalDateTime,
    @get:Schema(description = "用户ID")
    @ExcelProperty("用户ID")
    val userid: String,
    @get:Schema(description = "用户姓名")
    @ExcelProperty("用户姓名")
    var userName: String? = null,
    @get:Schema(description = "单位ID")
    @ExcelProperty("单位ID")
    val orgId: String,
    @get:Schema(description = "单位名称")
    @ExcelProperty("单位名称")
    var orgName: String? = null,
    @get:Schema(description = "反馈内容")
    @ExcelProperty("反馈内容")
    val content: String,
    @get:Schema(description = "反馈图片")
    @ExcelProperty("反馈图片")
    var images: List<String>,
    @get:Schema(description = "问题分类")
    @ExcelProperty("问题分类")
    val problemCategory: Int?,
    @get:Schema(description = "处理状态")
    @ExcelProperty("处理状态")
    val status: Boolean?,
    @param:Schema(description = "责任部门")
    val operator: String?,
    @get:Schema(description = "处理结果")
    @ExcelProperty("处理结果")
    val result: String?,
    @get:Schema(description = "申请人手机号")
    @ExcelProperty("申请人手机号")
    val userMobile: String?,
    @get:Schema(description = "是否为处理人")
    var beOperator: Boolean = false,
) : S3Transformable {
    @get:Schema(description = "问题分类")
    @get:JsonLabel("problem_type")
    val problemCategoryLabel: String
        get() = (problemCategory ?: 5).toString()

    constructor(record: UserFeedback) : this(
        id = record.id!!,
        createTime = record.createTime!!,
        updateTime = record.updateTime!!,
        userid = record.userid!!,
        orgId = record.orgId!!,
        content = record.content!!,
        images = record.images!!.takeIf { it.isNotEmpty() }?.split(',') ?: emptyList(),
        problemCategory = record.problemCategory,
        status = record.status,
        operator = record.operator,
        result = record.result,
        userMobile = record.userMobile
    )

    override fun s3transform(transform: (String) -> String) {
        images = images.map(transform)
    }
}
