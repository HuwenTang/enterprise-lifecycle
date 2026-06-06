package com.tzdig.framework.model.dto

data class ChangePasswordDTO(
    val oldPassword: String,
    val newPassword: String,
)
