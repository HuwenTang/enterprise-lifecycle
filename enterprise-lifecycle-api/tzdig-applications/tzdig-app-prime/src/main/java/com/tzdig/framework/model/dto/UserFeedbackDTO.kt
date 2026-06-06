package com.tzdig.framework.model.dto

import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.mybatis.entity.prime.UserFeedback
import com.tzdig.framework.mybatis.entity.system.UserAccount
import io.swagger.v3.oas.annotations.media.Schema

data class UserFeedbackDTO(
    @param:Schema(description = "所属单位ID")
    val orgId: String?,
    @param:Schema(description = "反馈内容")
    val content: String?,
    @param:Schema(description = "反馈图片")
    val images: List<String> = emptyList(),
    @param:Schema(description = "问题分类")
    val problemCategory: Int?,
    @param:Schema(description = "处理状态")
    val status: Boolean?,
    @param:Schema(description = "责任部门")
    val operator: String?,
    @param:Schema(description = "处理结果")
    val result: String?,
    @param:Schema(description = "处理图片")
    val images2: List<FileDownloadVO> = emptyList(),
) {
    fun toUserFeedback(userAccount: UserAccount): UserFeedback =
        UserFeedback {
            this.userid = userAccount.id
            this.userMobile = userAccount.mobile
            into(this)
        }

    fun into(record: UserFeedback): UserFeedback {
        record.orgId = orgId
        record.content = content
        record.images = images.joinToString(",")
        record.problemCategory = problemCategory
        record.status = status
        record.operator = operator
        record.result = result
        return record
    }
}
