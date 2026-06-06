package com.tzdig.framework.file.config

import com.tzdig.framework.file.annotation.S3Transformable
import com.tzdig.framework.file.properties.S3Properties
import com.tzdig.framework.file.service.S3Service
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.core.MethodParameter
import org.springframework.http.MediaType
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice

@ControllerAdvice
@ConditionalOnBean(S3Properties::class)
class S3TransformAdvice(
    private val s3Service: S3Service,
) : ResponseBodyAdvice<S3Transformable> {
    override fun supports(returnType: MethodParameter, converterType: Class<out HttpMessageConverter<*>>) =
        S3Transformable::class.java.isAssignableFrom(returnType.parameterType)

    override fun beforeBodyWrite(
        body: S3Transformable?,
        returnType: MethodParameter,
        selectedContentType: MediaType,
        selectedConverterType: Class<out HttpMessageConverter<*>>,
        request: ServerHttpRequest,
        response: ServerHttpResponse,
    ): S3Transformable? {
        body?.s3transform { uri ->
            val path = uri.substringBefore('?').substringBefore('#')
            val filename = uri.substringAfterLast('#', "")
            val url = if (path.isEmpty()) path
            else s3Service.getSignedObjectUrl(path, filename = filename, disposition = body.disposition) ?: path
            "${url}#${filename}"
        }
        return body
    }
}
