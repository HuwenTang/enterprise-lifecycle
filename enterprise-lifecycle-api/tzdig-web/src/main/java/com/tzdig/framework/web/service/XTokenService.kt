package com.tzdig.framework.web.service

interface XTokenService {
    fun generateToken(): Pair<String, String>
    fun verifyToken(tokenKey: String, tokenValue: String): Boolean
}
