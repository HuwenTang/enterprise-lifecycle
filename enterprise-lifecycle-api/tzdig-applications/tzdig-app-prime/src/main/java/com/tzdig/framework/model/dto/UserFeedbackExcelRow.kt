package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.UserFeedback

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class UserFeedbackExcelRow(
    @field:ExcelProperty("反馈人用户ID")
    var userid: String? = null,
    @field:ExcelProperty("所属单位ID")
    var orgId: String? = null,
    @field:ExcelProperty("反馈内容")
    var content: String? = null,
    @field:ExcelProperty("反馈图片")
    var images: String? = null,
    @field:ExcelProperty("问题分类")
    var problemCategory: Int? = null,
    @field:ExcelProperty("处理状态")
    var status: Boolean? = null,
    @field:ExcelProperty("责任部门")
    var operator: String? = null,
    @field:ExcelProperty("处理结果")
    var result: String? = null,
) : ExcelRow<UserFeedbackExcelRow>() {
    fun toUserFeedback(): UserFeedback =
        UserFeedback {
            into(this)
        }

    fun into(record: UserFeedback): UserFeedback {
        record.userid = userid
        record.orgId = orgId
        record.content = content
        record.images = images
        record.problemCategory = problemCategory
        record.status = status
        record.operator = operator
        record.result = result
        return record
    }
}
