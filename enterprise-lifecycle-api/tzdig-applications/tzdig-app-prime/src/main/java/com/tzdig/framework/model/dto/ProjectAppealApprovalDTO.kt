@file:Suppress("unused")

package com.tzdig.framework.model.dto

import io.swagger.v3.oas.annotations.media.Schema

data class ProjectAppealApprovalDTO(
    @param:Schema(description = "申诉意见")
    val result: Boolean,
    @param:Schema(description = "申诉意见")
    val content: String,
)
