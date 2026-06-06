package com.tzdig.framework.web.exception

import org.springframework.http.HttpStatus

class BadRequestException(override val message: String) : ApiException(message, HttpStatus.BAD_REQUEST)
