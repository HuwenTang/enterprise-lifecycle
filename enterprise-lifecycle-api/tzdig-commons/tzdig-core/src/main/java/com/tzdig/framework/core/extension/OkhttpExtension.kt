@file:Suppress("unused")

package com.tzdig.framework.core.extension

import com.alibaba.fastjson2.parseObject
import com.alibaba.fastjson2.toJSONString
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.MediaType

private object OkhttpExtension

val logger: Logger = LoggerFactory.getLogger(OkhttpExtension::class.java)

val APPLICATION_JSON_MEDIA_TYPE = MediaType.APPLICATION_JSON_VALUE.toMediaType()

inline fun <reified T : Any> T.toJsonRequest() =
    toJSONString().also { logger.debug("request: {}", it) }
        .toRequestBody(APPLICATION_JSON_MEDIA_TYPE)

inline fun <reified T : Any> Response.retrieve(): T =
    string().parseObject<T>()

fun Response.string(): String =
    use { body.string() }.also { logger.debug("response: {}", it) }
