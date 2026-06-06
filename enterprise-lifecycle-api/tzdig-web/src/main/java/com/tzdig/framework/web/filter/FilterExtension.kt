package com.tzdig.framework.web.filter

import jakarta.servlet.http.HttpServletRequest
import java.net.URI

internal fun HttpServletRequest.filterLog(): Boolean =
    requestURI.endsWith("/actuator/health") || requestURI.endsWith("/api-docs")

internal val HttpServletRequest.isValid: Boolean
    get() = runCatching {
        URI(requestURL.toString())
        true
    }.getOrDefault(false)
