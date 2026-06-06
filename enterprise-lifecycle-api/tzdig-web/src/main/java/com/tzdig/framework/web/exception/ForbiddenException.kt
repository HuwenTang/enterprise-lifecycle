package com.tzdig.framework.web.exception

import org.springframework.http.HttpStatus

abstract class ForbiddenException : ApiException(HttpStatus.FORBIDDEN.name, HttpStatus.FORBIDDEN) {
    companion object : ForbiddenException()
}
