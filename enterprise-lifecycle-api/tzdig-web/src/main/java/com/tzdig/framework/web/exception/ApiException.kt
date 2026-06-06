package com.tzdig.framework.web.exception

import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.web.server.ResponseStatusException

open class ApiException(
    override val message: String,
    private val status: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
) : ResponseStatusException(status) {
    val response get() = Response(status = status.value(), message = message)

    data class Response(
        val status: Int = -1,
        val message: String,
    ) {
        constructor(
            response: HttpServletResponse,
            message: String = "",
        ) : this(response.status, message = message)
    }
}
