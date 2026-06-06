package com.tzdig.framework.model.dto

import io.swagger.v3.oas.annotations.media.Schema

data class ResetPasswordDTO(
    @Schema(description = "重置密码")
    val password: String,
)
