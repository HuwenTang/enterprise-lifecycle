package com.tzdig.framework.web.service.impl

import cn.dev33.satoken.context.SaHolder
import cn.dev33.satoken.stp.StpUtil
import com.alibaba.fastjson2.filter.SimplePropertyPreFilter
import com.alibaba.fastjson2.toJSONString
import com.tzdig.framework.core.util.ThreadPoolUtils
import com.tzdig.framework.core.util.toInstant
import com.tzdig.framework.core.util.toLocalDateTime
import com.tzdig.framework.mybatis.entity.system.SystemLog
import com.tzdig.framework.web.annotation.Log
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.service.LogService
import jakarta.servlet.http.HttpServletRequest
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.reflect.MethodSignature
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RequestBody


@Service
class LogServiceImpl : LogService {
    private val timeThreadLocal = ThreadLocal<Long>()
    private val excludeFields = arrayOf("password", "passwd")
    private val logger = LoggerFactory.getLogger(javaClass)
    override fun processBefore() = timeThreadLocal.set(System.currentTimeMillis())

    override fun processReturning(log: Log, joinPoint: JoinPoint, result: Any?) {
        val requestBody = if (log.ignoreRequestBody) null else getRequestBody(joinPoint)
        val responseBody = if (log.ignoreResponseBody) null else result?.toJSONString()
        processLog(log, requestBody, responseBody, true)
    }

    override fun processThrowing(log: Log, joinPoint: JoinPoint, e: Throwable) {
        val requestBody = if (log.ignoreRequestBody) null else getRequestBody(joinPoint)
        val resp = if (e is ApiException) e.response
        else ApiException.Response(message = e.message ?: e.javaClass.name)
        val responseBody = resp.toJSONString()
        processLog(log, requestBody, responseBody, false)
    }

    private fun getRequestBody(joinPoint: JoinPoint): String? {
        val signature = joinPoint.signature as MethodSignature
        val method = signature.method
        val args = joinPoint.args
        val parameters = method.parameters
        val obj = parameters.indexOfFirst { it.isAnnotationPresent(RequestBody::class.java) }
            .takeIf { it >= 0 }
            ?.let { args[it] }
            ?: return null
        val filter = SimplePropertyPreFilter()
        for (field in obj::class.java.declaredFields) {
            val exclude = excludeFields.any { excludeField ->
                field.name.contains(excludeField, true)
            }
            if (exclude) filter.excludes.add(field.name)
        }
        return obj.toJSONString(filter)
    }

    fun processLog(
        log: Log,
        requestBody: String?,
        responseBody: String?,
        success: Boolean,
    ) {
        val startTime = timeThreadLocal.get()!!
        val endTime = System.currentTimeMillis()
        val request = SaHolder.getRequest().source as HttpServletRequest
        val parameter = request.parameterMap
            .map { (key, value) -> "${key}=${value.joinToString(",")}" }
            .joinToString("&")
            .let { if (it.isNotEmpty()) "?$it" else "" }
        val record = SystemLog {
            this.userid = if (StpUtil.isLogin()) StpUtil.getLoginIdAsString() else null
            this.name = log.name
            this.type = log.type
            this.method = request.method
            this.uri = request.requestURI + parameter
            this.requestBody = requestBody ?: ""
            this.responseBody = responseBody ?: "{}"
            this.success = success
            this.startTime = startTime.toInstant().toLocalDateTime()
            this.endTime = endTime.toInstant().toLocalDateTime()
            this.duration = endTime - startTime
        }
        ThreadPoolUtils.runAsync {
            try {
                record.save()
            } catch (e: Exception) {
                logger.error("Save SystemLog Error: {}", e.message, e)
            }
        }
    }
}
