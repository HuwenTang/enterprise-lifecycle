package com.tzdig.framework.web.annotation

import com.tzdig.framework.mybatis.entity.system.SystemLog

typealias LogType = SystemLog.Type

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FUNCTION)
annotation class Log(
    val name: String,
    val type: LogType = LogType.OTHER,
    val ignoreRequestBody: Boolean = false,
    val ignoreResponseBody: Boolean = false,
)
