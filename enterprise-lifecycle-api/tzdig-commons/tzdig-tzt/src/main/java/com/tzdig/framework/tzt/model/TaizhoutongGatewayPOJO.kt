package com.tzdig.framework.tzt.model

import com.tzdig.framework.core.util.SM2Utils
import com.tzdig.framework.core.util.sm3
import okhttp3.FormBody

data class TaizhoutongGatewayPOJO(
    /**
     * API请求的应用唯一标识,例如：'hadAsdafawe'
     */
    val appUniqueId: String,
    /**
     * API请求的接口唯一标识，例如：'dfefDDAdf'
     */
    val interfaceUniqueId: String,
    /**
     * 调用方提交的头部参数，JSON格式字符串.
     */
    val header: String = "{}",
    /**
     * 请求的接口版本
     */
    val version: String = "1.0",
    /**
     * 请求的编码格式
     */
    val charset: String = "UTF-8",
    /**
     * 接口渠道 0：PC；1：APP；2：支付宝；3：微信（网关请求参数）
     */
    val origin: String = "1",
    /**
     * 调用方提交的业务参数，JSON格式字符串.
     */
    var bizContent: String = "",
    /**
     * 请求参数的签名串
     */
    var sign: String = "",
    /**
     * 客户端发起调用的时间戳，即1970年1月1日至今的毫秒数
     */
    val timestamp: String = System.currentTimeMillis().toString(),
) {
    fun createBizContent(content: String, publicKey: String): TaizhoutongGatewayPOJO {
        bizContent = SM2Utils.encrypt(publicKey, content)
        return this
    }

    fun createSign(): TaizhoutongGatewayPOJO {
        sign = getSignCheckContentV2().toByteArray().sm3()
        return this
    }

    private fun getSignCheckContentV2(): String = with(toMap()) {
        keys.sorted()
            .mapNotNull {
                val value = this[it]
                if (value.isNullOrEmpty()) null
                else "${it}=${value}"
            }
            .joinToString("&")
    }

    private fun toMap() = mapOf(
        "app_id" to appUniqueId,
        "interface_id" to interfaceUniqueId,
        "version" to version,
        "biz_content" to bizContent.replace("\"", "&quot;"),
        "charset" to charset,
        "timestamp" to timestamp,
        "origin" to origin,
    )

    fun toFormBody() = FormBody.Builder()
        .addEncoded("app_id", appUniqueId)
        .addEncoded("interface_id", interfaceUniqueId)
        .addEncoded("version", version)
        .addEncoded("header", header)
        .addEncoded("biz_content", bizContent)
        .addEncoded("charset", charset)
        .addEncoded("timestamp", timestamp)
        .addEncoded("origin", origin)
        .addEncoded("sign", sign)
        .build()
}
