package com.tzdig.framework.tzt.model

import com.alibaba.fastjson2.JSONObject
import com.alibaba.fastjson2.parseObject

data class TaizhengtongApiResult(
    val errCode: Int,
    val errMsg: String,
    val data: String?,
) {
    fun parseData(): JSONObject? = data?.parseObject()
    inline fun <reified T> parseData(): T? = data?.parseObject<T>()
}
