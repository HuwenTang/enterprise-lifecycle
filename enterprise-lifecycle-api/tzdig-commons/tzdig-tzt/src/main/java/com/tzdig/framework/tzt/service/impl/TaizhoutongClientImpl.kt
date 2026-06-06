package com.tzdig.framework.tzt.service.impl

import com.alibaba.fastjson2.parseObject
import com.tzdig.framework.core.extension.string
import com.tzdig.framework.core.util.SM2Utils
import com.tzdig.framework.tzt.model.TaizhoutongGatewayPOJO
import com.tzdig.framework.tzt.properties.TaizhoutongProperties
import com.tzdig.framework.tzt.service.TaizhoutongClient
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import org.springframework.stereotype.Service

@Service
class TaizhoutongClientImpl(
    private val taizhoutongProperties: TaizhoutongProperties,
    private val okHttpClient: OkHttpClient,
) : TaizhoutongClient {
    private fun sendRequest(
        interfaceUniqueId: String,
        content: String,
    ): Response {
        val taizhoutongGatewayPOJO = TaizhoutongGatewayPOJO(
            appUniqueId = taizhoutongProperties.appid,
            interfaceUniqueId = interfaceUniqueId,
        )
        taizhoutongGatewayPOJO
            .createBizContent(content, taizhoutongProperties.publicKey)
            .createSign()
        val request = Request.Builder()
            .url(url = "https://tzt-app.tzdig.cn/api-gateway/jpaas-jags-server/interface/gateway.do")
            .post(body = taizhoutongGatewayPOJO.toFormBody())
            .build()
        return okHttpClient.newCall(request).execute()
    }

    override fun getToken(ticket: String): String? {
        val response = sendRequest(
            interfaceUniqueId = "ticketValidate",
            content = String.format(
                "{\"appMark\":\"%s\",\"params\":\"{ticket:\\\"%s\\\"}\"}",
                taizhoutongProperties.appid,
                ticket,
            ),
        )
        val encryptData = response.string().parseObject().getString("data") ?: return null
        val decryptData = SM2Utils.decrypt(taizhoutongProperties.privateKey, encryptData)
        val result = decryptData.parseObject().getString("data") ?: return null
        return result.parseObject().getString("token")
    }

    override fun getMobile(token: String): String? {
        val response = sendRequest(
            interfaceUniqueId = "findPerUserByToken",
            content = String.format(
                "{\"appMark\":\"%s\",\"params\":\"{token:\\\"%s\\\"}\"}",
                taizhoutongProperties.appid,
                token,
            ),
        )
        val encryptData = response.string().parseObject().getString("data") ?: return null
        val decryptData = SM2Utils.decrypt(taizhoutongProperties.privateKey, encryptData)
        val result = decryptData.parseObject().getString("data") ?: return null
        return result.parseObject().getString("mobile")
    }
}
