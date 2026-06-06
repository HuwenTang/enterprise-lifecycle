@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectAppealComment
import com.tzdig.framework.security.extension.userAccount
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectAppealCommentDTO(
    @param:Schema(description = "申诉ID")
    val appealId: String?,
    @param:Schema(description = "回复ID")
    val replyToId: String?,
    @param:Schema(description = "意见内容")
    val content: String?,
) {
    fun toProjectAppealComment(): ProjectAppealComment =
        ProjectAppealComment {
            userid = userAccount.id
            into(this)
        }

    fun into(record: ProjectAppealComment): ProjectAppealComment {
        record.appealId = appealId
        record.replyToId = replyToId
        record.content = content
        return record
    }
}
