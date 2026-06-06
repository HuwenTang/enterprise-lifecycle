package com.tzdig.framework.web.exception

import cn.dev33.satoken.exception.NotLoginException
import cn.dev33.satoken.exception.SaTokenException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.method.annotation.HandlerMethodValidationException
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.servlet.resource.NoResourceFoundException
import java.io.FileNotFoundException

@ControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(javaClass)

    @ResponseBody
    @ExceptionHandler(ApiException::class)
    fun handleApiException(
        e: ApiException,
        response: HttpServletResponse,
    ): ApiException.Response {
        response.status = e.statusCode.value()
        return e.response
    }

    @ResponseBody
    @ExceptionHandler(NotLoginException::class)
    fun handleNotLoginException(
        response: HttpServletResponse,
    ) = handleApiException(UnauthorizedException, response)

    @ResponseBody
    @ExceptionHandler(SaTokenException::class)
    fun handleSaTokenException(
        e: SaTokenException,
        response: HttpServletResponse,
    ): ApiException.Response {
        logger.debug("SaTokenException: {}", e.message, e)
        return handleApiException(ForbiddenException, response)
    }

    @ResponseBody
    @ExceptionHandler(NoResourceFoundException::class)
    fun handleNoResourceFoundException(
        e: NoResourceFoundException,
        response: HttpServletResponse,
    ): ApiException.Response {
        response.status = e.statusCode.value()
        return ApiException.Response(response)
    }

    @ResponseBody
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentNotValidException(
        e: MethodArgumentNotValidException,
        response: HttpServletResponse,
    ): ApiException.Response {
        response.status = HttpStatus.BAD_REQUEST.value()
        return ApiException.Response(message = e.fieldError?.defaultMessage ?: "BAD REQUEST")
    }

    @ResponseBody
    @ExceptionHandler(HandlerMethodValidationException::class)
    fun handleHandlerMethodValidationException(
        e: HandlerMethodValidationException,
        response: HttpServletResponse,
    ): ApiException.Response {
        response.status = HttpStatus.BAD_REQUEST.value()
        return ApiException.Response(
            message = e.parameterValidationResults
                .firstOrNull()
                ?.resolvableErrors
                ?.firstOrNull()
                ?.defaultMessage
                ?: "BAD REQUEST"
        )
    }

    @ResponseBody
    @ExceptionHandler(Exception::class)
    fun handleException(
        e: Exception,
        request: HttpServletRequest,
        response: HttpServletResponse,
    ): ApiException.Response {
        logger.error("====> 全局异常: {} {}", request.method, request.requestURI)
        request.parameterMap.forEach { (key: String, value: Array<String>) ->
            logger.error("请求参数: {} = {}", key, value)
        }
        logger.error("异常信息: {}", e.message, e)
        response.status = when (e) {
            is ResponseStatusException -> e.statusCode
            is HttpMessageNotReadableException -> HttpStatus.BAD_REQUEST
            is IllegalArgumentException -> HttpStatus.BAD_REQUEST
            is IllegalStateException -> HttpStatus.BAD_REQUEST
            is FileNotFoundException -> HttpStatus.NOT_FOUND

            else -> HttpStatus.INTERNAL_SERVER_ERROR
        }.value()

        return when (e) {
            is ResponseStatusException -> ApiException.Response(message = e.reason ?: e.message)
            else -> ApiException.Response(message = "系统异常")
        }
    }
}
