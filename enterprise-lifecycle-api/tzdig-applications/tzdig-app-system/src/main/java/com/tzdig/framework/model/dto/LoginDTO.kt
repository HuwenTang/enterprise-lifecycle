package com.tzdig.framework.model.dto

data class LoginDTO(
    val endpoint: Endpoint?,
    private val origin: String?,
    val mobile: String?,
    val password: String?,
    val code: String?,
    val ticket: String?,
) {
    val grantType get() = origin

    enum class Endpoint {
        PC,
        H5,
    }
}
