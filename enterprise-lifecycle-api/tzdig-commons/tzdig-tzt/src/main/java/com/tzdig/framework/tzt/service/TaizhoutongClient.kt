package com.tzdig.framework.tzt.service

interface TaizhoutongClient {
    fun getToken(ticket: String): String?
    fun getMobile(token: String): String?
}
