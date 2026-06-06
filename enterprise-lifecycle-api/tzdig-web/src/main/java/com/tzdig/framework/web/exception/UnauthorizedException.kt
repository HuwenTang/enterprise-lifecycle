package com.tzdig.framework.web.exception

import org.springframework.http.HttpStatus

abstract class UnauthorizedException : ApiException(HttpStatus.UNAUTHORIZED.name, HttpStatus.UNAUTHORIZED) {
    companion object : UnauthorizedException()
}
