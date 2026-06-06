package com.tzdig.framework.sms.service.impl

import com.tzdig.framework.core.extension.retrieve
import com.tzdig.framework.core.extension.toJsonRequest
import com.tzdig.framework.core.util.b64encoded
import com.tzdig.framework.core.util.md5
import com.tzdig.framework.sms.model.GroupRequest
import com.tzdig.framework.sms.model.MassRequest
import com.tzdig.framework.sms.model.SmsResponse
import com.tzdig.framework.sms.properties.SmsProperties
import com.tzdig.framework.sms.service.SmsService
import okhttp3.OkHttpClient
import okhttp3.Request
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service

@Service
@ConditionalOnBean(SmsProperties::class)
class SmsServiceImpl(
    private val smsProperties: SmsProperties,
    private val okHttpClient: OkHttpClient,
) : SmsService {
    private val authorization = "${smsProperties.username}:${smsProperties.password.toByteArray().md5()}"
        .toByteArray()
        .b64encoded

    override fun sendMassMessage(content: String, mobiles: List<String>): SmsResponse {
        val requestBody = MassRequest(content = content, items = mobiles.map(MassRequest::MsgItem)).toJsonRequest()
        val request = Request.Builder()
            .url("http://${smsProperties.apiIp}:${smsProperties.apiPort}/api/message/mass/send")
            .header(HttpHeaders.AUTHORIZATION, authorization)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()
        return response.retrieve()
    }

    override fun sendGroupMessage(messages: List<GroupRequest.MsgItem>): SmsResponse {
        val requestBody = GroupRequest(items = messages.toList()).toJsonRequest()
        val request = Request.Builder()
            .url("http://${smsProperties.apiIp}:${smsProperties.apiPort}/api/message/group/send")
            .header(HttpHeaders.AUTHORIZATION, authorization)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()
        return response.retrieve()
    }
}
