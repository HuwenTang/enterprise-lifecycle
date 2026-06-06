package com.tzdig.framework.web.filter

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.util.ContentCachingRequestWrapper
import org.springframework.web.util.ContentCachingResponseWrapper
import org.springframework.web.util.WebUtils

@Configuration
@Order(Ordered.LOWEST_PRECEDENCE - 10)
class LogTraceFilter : OncePerRequestFilter() {
    private val log = LoggerFactory.getLogger(javaClass)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        if (!request.isValid || request.filterLog()) {
            return filterChain.doFilter(request, response)
        }
        val httpRequest = request as? ContentCachingRequestWrapper ?: ContentCachingRequestWrapper(request)
        val httpResponse = response as? ContentCachingResponseWrapper ?: ContentCachingResponseWrapper(response)
        var status = HttpStatus.INTERNAL_SERVER_ERROR.value()
        val startTime = System.currentTimeMillis()
        try {
            filterChain.doFilter(httpRequest, httpResponse)
            status = httpResponse.status
        } finally {
            log.info(
                "{} {}{}, status={}, duration={}ms",
                httpRequest.method,
                httpRequest.requestURI,
                request.queryString?.let { "?$it" } ?: "",
                status,
                System.currentTimeMillis() - startTime)
            log.info("request: {}", httpRequest.body)
            log.info("response: {}", httpResponse.body)
            httpResponse.update()
        }
    }

    private val ContentCachingRequestWrapper.body: String
        get() {
            val type = contentType?.let { MediaType.parseMediaType(it) }
            if (REQUEST_CONTENT_TYPE.none { it.equalsTypeAndSubtype(type) }) return "<$contentType>"
            val wrapper = WebUtils.getNativeRequest(this, ContentCachingRequestWrapper::class.java)
            return wrapper?.contentAsByteArray.formatLog()
        }

    private val ContentCachingResponseWrapper.body: String
        get() {
            val type = contentType?.let { MediaType.parseMediaType(it) }
            if (type != null && RESPONSE_CONTENT_TYPE.none { it.equalsTypeAndSubtype(type) }) return "Ignored Content-Type: $contentType"
            val wrapper = WebUtils.getNativeResponse(this, ContentCachingResponseWrapper::class.java)
            return wrapper?.contentAsByteArray.formatLog()
        }

    private fun ByteArray?.formatLog(): String {
        if (this == null) return "<null>"
        if (isEmpty()) return "<empty>"
        val string = decodeToString()
        val maxLength = 1000
        return if (string.length > maxLength) {
            string.take(maxLength) + "......"
        } else {
            string
        }
    }

    private fun ContentCachingResponseWrapper.update() =
        WebUtils.getNativeResponse(this, ContentCachingResponseWrapper::class.java)?.copyBodyToResponse()
}

private val REQUEST_CONTENT_TYPE: Array<MediaType> = arrayOf(
    MediaType.APPLICATION_JSON,
    MediaType.APPLICATION_FORM_URLENCODED,
)
private val RESPONSE_CONTENT_TYPE: Array<MediaType> = arrayOf(
    MediaType.APPLICATION_JSON,
    MediaType.APPLICATION_XHTML_XML,
    MediaType.TEXT_PLAIN,
)
