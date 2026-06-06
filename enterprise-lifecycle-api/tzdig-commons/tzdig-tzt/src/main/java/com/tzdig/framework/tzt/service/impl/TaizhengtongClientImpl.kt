package com.tzdig.framework.tzt.service.impl

import com.alibaba.fastjson2.JSONObject
import com.tzdig.framework.core.constant.CacheConstants
import com.tzdig.framework.core.extension.retrieve
import com.tzdig.framework.core.extension.toJsonRequest
import com.tzdig.framework.core.util.sha1
import com.tzdig.framework.tzt.model.*
import com.tzdig.framework.tzt.properties.TaizhengtongProperties
import com.tzdig.framework.tzt.service.TaizhengtongClient
import okhttp3.OkHttpClient
import okhttp3.Request
import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import org.springframework.web.util.UriComponentsBuilder
import java.io.IOException
import java.util.*

@Service
class TaizhengtongClientImpl(
    private val taizhengtongProperties: TaizhengtongProperties,
    private val okHttpClient: OkHttpClient,
) : TaizhengtongClient {
    private val logger = LoggerFactory.getLogger(javaClass)

    @Cacheable(CacheConstants.TAIZHENGTONG_APP_TOKEN)
    override fun getAppToken(): String {
        if (taizhengtongProperties.appid.isEmpty() || taizhengtongProperties.secret.isEmpty()) {
            throw IOException("TaizhengtongAppToken")
        }
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/v1/apptoken/create")
            .queryParam("grant_type", "client_credential")
            .queryParam("appid", taizhengtongProperties.appid)
            .queryParam("secret", taizhengtongProperties.secret)
            .toUriString()
        val request = Request.Builder()
            .url(url)
            .build()
        val response = okHttpClient.newCall(request).execute()
        val data = response.retrieve<TaizhengtongApiResult>().parseData()!!
        return data.getString("appToken")!!
    }

    override fun getJsApiToken(appToken: String): String {
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/v1/jsapitoken/create")
            .queryParam("app_token", appToken)
            .toUriString()
        val request = Request.Builder()
            .url(url)
            .build()
        val response = okHttpClient.newCall(request).execute()
        val data = response.retrieve<TaizhengtongApiResult>().parseData()!!
        return data.getString("jsApiToken")!!
    }

    /**
     * 生成签名所需的完整参数包
     * @return 包含 nonce, timestamp, signature 的对象
     */
    override fun getSignature(jsApiToken: String, url: String): SignatureResult {
        val nonce = UUID.randomUUID().toString()
        val timestamp = System.currentTimeMillis()
        val signatureStr = "js_api_token=$jsApiToken&noncestr=$nonce&timestamp=$timestamp&url=$url"
        return SignatureResult(
            nonce = nonce,
            timestamp = timestamp,
            signature = signatureStr.toByteArray().sha1()
        )
    }

    override fun getUserToken(appToken: String, code: String): String? {
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/v1/usertoken/create")
            .queryParam("grant_type", "authorization_code")
            .queryParam("app_token", appToken)
            .queryParam("code", code)
            .toUriString()
        val request = Request.Builder()
            .url(url)
            .build()
        val response = okHttpClient.newCall(request).execute()
        val data = response.retrieve<TaizhengtongApiResult>().parseData() ?: return null
        return data.getString("userToken")
    }

    override fun getMobile(appToken: String, userToken: String): String? {
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/v1/users/fetch")
            .queryParam("app_token", appToken)
            .queryParam("user_token", userToken)
            .toUriString()
        val request = Request.Builder()
            .url(url)
            .build()
        val response = okHttpClient.newCall(request).execute()
        val data = response.retrieve<TaizhengtongApiResult>().parseData() ?: return null
        val mobilePhone = data.getJSONObject("mobilePhone") ?: return null
        return mobilePhone.getString("number")
    }

    override fun getTags(appToken: String, staffId: String): MutableSet<String>? {
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/v1/staffs/${staffId}/infor/fetch")
            .queryParam("app_token", appToken)
            .toUriString()
        val request = Request.Builder()
            .url(url)
            .build()
        val response = okHttpClient.newCall(request).execute()
        val data = response.retrieve<TaizhengtongApiResult>().parseData()
            ?: return null
        return data.getJSONArray("tags")
            ?.mapNotNull { it as? String }
            ?.toMutableSet()
            ?: mutableSetOf()
    }

    override fun setTags(appToken: String, staffId: String, tags: Set<String>) {
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/v1/staffs/${staffId}/update")
            .queryParam("app_token", appToken)
            .toUriString()
        val requestBody = mapOf("tags" to tags).toJsonRequest()
        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()
        val result = response.retrieve<TaizhengtongApiResult>()
        if (result.errCode != 0) throw RuntimeException("修改授权状态失败")
    }

    @Cacheable(CacheConstants.TAIZHENGTONG_FETCH_DEPARTMENTS)
    override fun fetchDepartments(appToken: String, organizationId: String): DepartmentsResult? {
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/v1/departments/${taizhengtongProperties.gid}-${organizationId}/children/fetch")
            .queryParam("app_token", appToken)
            .toUriString()
        logger.debug("fetchDepartments: {}", url)
        val request = Request.Builder()
            .url(url)
            .get()
            .build()
        val response = okHttpClient.newCall(request).execute()
        return response.retrieve<TaizhengtongApiResult>().parseData<DepartmentsResult>()
    }

    @Cacheable(CacheConstants.TAIZHENGTONG_FETCH_STAFFS)
    override fun fetchStaffs(appToken: String, organizationId: String): DepartmentStaffsResult? {
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/v1/departments/${taizhengtongProperties.gid}-${organizationId}/staffs/fetch")
            .queryParam("app_token", appToken)
            .toUriString()
        logger.debug("fetchStaffs: {}", url)
        val request = Request.Builder()
            .url(url)
            .get()
            .build()
        val response = okHttpClient.newCall(request).execute()
        return response.retrieve<TaizhengtongApiResult>().parseData<DepartmentStaffsResult>()
    }

    override fun createTask(appToken: String, taskRequest: TaskRequest): String? {
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/xtra/tdtask/server/openapi/v2/taskopt/create")
            .queryParam("app_token", appToken)
            .toUriString()
        val requestBody = taskRequest.toJsonRequest()
        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()
        val result = response.retrieve<TaizhengtongApiResult>().parseData()
            ?: return null
        return result.getString("taskCode")
    }

    override fun getTaskInfo(appToken: String, taskCode: String): JSONObject? {
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/xtra/tdtask/server/openapi/v2/task/info")
            .queryParam("app_token", appToken)
            .toUriString()
        val requestBody = mapOf(
            "orgId" to taizhengtongProperties.gid,
            "taskCode" to taskCode,
        ).toJsonRequest()
        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()
        val result = response.retrieve<TaizhengtongApiResult>()
        return result.parseData()
    }

    override fun updateTaskStatus(appToken: String, taskCode: String, staffId: String, status: Int) {
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/xtra/tdtask/server/openapi/v2/taskopt/updateStatus")
            .queryParam("app_token", appToken)
            .toUriString()
        val requestBody = mapOf(
            "orgId" to taizhengtongProperties.gid,
            "taskCode" to taskCode,
            "staffId" to staffId,
            "status" to status,
        ).toJsonRequest()
        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()
        response.retrieve<TaizhengtongApiResult>()
    }

    override fun deleteTask(appToken: String, taskCode: String) {
        val url = UriComponentsBuilder
            .fromUriString("https://itz-manage.taizhou.gov.cn:10443/open/apigw/xtra/tdtask/server/openapi/v2/taskopt/creatorDelTask")
            .queryParam("app_token", appToken)
            .toUriString()
        val requestBody = mapOf(
            "orgId" to taizhengtongProperties.gid,
            "taskCode" to taskCode,
        ).toJsonRequest()
        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .build()
        val response = okHttpClient.newCall(request).execute()
        response.retrieve<TaizhengtongApiResult>()
    }
}
