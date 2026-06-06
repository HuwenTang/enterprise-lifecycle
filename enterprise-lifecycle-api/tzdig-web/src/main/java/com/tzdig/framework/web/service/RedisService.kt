package com.tzdig.framework.web.service

import org.springframework.data.redis.core.*
import java.time.Instant
import kotlin.time.Duration

interface RedisService {
    fun opsForValue(): ValueOperations<String, Any>
    fun opsForList(): ListOperations<String, Any>
    fun opsForSet(): SetOperations<String, Any>
    fun opsForZSet(): ZSetOperations<String, Any>
    fun opsForHash(): HashOperations<String, String, Any>

    fun hasKey(key: String): Boolean
    fun delete(vararg keys: String): Long
    fun getExpire(key: String): Duration?
    fun expire(key: String, time: Duration): Boolean?
    fun expireAt(key: String, time: Instant): Boolean?
}
