package com.tzdig.framework.web.exception

import org.springframework.http.HttpStatus

class NotFoundException(override val message: String) : ApiException(message, HttpStatus.NOT_FOUND)
