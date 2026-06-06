package com.tzdig.framework.web.service.impl

import com.tzdig.framework.web.service.RedisService
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import java.time.Instant
import kotlin.time.Duration
import kotlin.time.DurationUnit
import kotlin.time.toDuration
import kotlin.time.toJavaDuration

@Service
class RedisServiceImpl(
    private val redisTemplate: RedisTemplate<String, Any>,
) : RedisService {
    override fun opsForValue() = redisTemplate.opsForValue()
    override fun opsForList() = redisTemplate.opsForList()
    override fun opsForSet() = redisTemplate.opsForSet()
    override fun opsForZSet() = redisTemplate.opsForZSet()
    override fun opsForHash() = redisTemplate.opsForHash<String, Any>()

    override fun hasKey(key: String) = redisTemplate.hasKey(key)
    override fun delete(vararg keys: String) = redisTemplate.delete(keys.asList())
    override fun getExpire(key: String) = redisTemplate.getExpire(key).toDuration(DurationUnit.SECONDS)
    override fun expire(key: String, time: Duration) = redisTemplate.expire(key, time.toJavaDuration())
    override fun expireAt(key: String, time: Instant) = redisTemplate.expireAt(key, time)
}
