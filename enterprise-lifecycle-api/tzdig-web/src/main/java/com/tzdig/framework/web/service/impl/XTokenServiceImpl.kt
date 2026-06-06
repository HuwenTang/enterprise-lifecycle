package com.tzdig.framework.web.service.impl

import com.tzdig.framework.web.service.RedisService
import com.tzdig.framework.web.service.XTokenService
import org.springframework.stereotype.Service
import kotlin.io.encoding.Base64
import kotlin.random.Random
import kotlin.time.Duration.Companion.seconds

@Service
class XTokenServiceImpl(
    private val redisService: RedisService,
) : XTokenService {
    override fun generateToken(): Pair<String, String> {
        val tokenKey = Base64.encode(Random.nextBytes(12))
        val tokenValue = Base64.encode(Random.nextBytes(12))
        val key = "X-Token::${tokenKey}"
        redisService.opsForValue().set(key, tokenValue)
        redisService.expire(key, 5.seconds)
        return tokenKey to tokenValue
    }

    override fun verifyToken(tokenKey: String, tokenValue: String): Boolean {
        val key = "X-Token::${tokenKey}"
        return redisService.opsForValue().get(key) == tokenValue
    }
}
