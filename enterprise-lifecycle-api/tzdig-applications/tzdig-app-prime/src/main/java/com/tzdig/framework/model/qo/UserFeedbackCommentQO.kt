package com.tzdig.framework.model.qo

import io.swagger.v3.oas.annotations.media.Schema

data class UserFeedbackCommentQO(
    @param:Schema(description = "反馈ID")
    val feedbackId: String? = null,
)
