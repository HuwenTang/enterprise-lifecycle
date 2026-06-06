@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProjectReview
import io.swagger.v3.oas.annotations.media.Schema

data class ProjectKeyProjectReviewDTO(
    @param:Schema(description = "重点项目id")
    val keyProjectId: String,
    @param:Schema(description = "项目级别")
    val keyProjectLevel: String?,
    @param:Schema(description = "项目评价")
    val comment: String?,
) {
    fun toProjectKeyProjectReview(): ProjectKeyProjectReview =
        ProjectKeyProjectReview {
            into(this)
        }

    fun into(record: ProjectKeyProjectReview): ProjectKeyProjectReview {
        record.keyProjectId = keyProjectId
        record.keyProjectLevel = keyProjectLevel
        record.comment = comment
        return record
    }
}
