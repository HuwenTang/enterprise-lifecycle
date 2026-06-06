package com.tzdig.framework.service

import com.alibaba.fastjson2.JSONObject

interface QichachaService {

    fun generateToken(loginName: String?, role: String?, name: String?, email: String?): String

    fun decryptToken(token: String): JSONObject?
}
