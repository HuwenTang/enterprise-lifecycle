package com.tzdig.framework.web.config

import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.fasterxml.jackson.annotation.PropertyAccessor
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.cache.RedisCache
import org.springframework.data.redis.cache.RedisCacheConfiguration
import org.springframework.data.redis.cache.RedisCacheManager
import org.springframework.data.redis.cache.RedisCacheWriter
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer
import org.springframework.data.redis.serializer.RedisSerializationContext
import org.springframework.data.redis.serializer.RedisSerializer
import org.springframework.data.redis.serializer.StringRedisSerializer
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.toJavaDuration

@EnableCaching
@Configuration
class RedisConfig {
    @Bean
    fun redisTemplate(
        redisConnectionFactory: RedisConnectionFactory,
    ): RedisTemplate<String, Any> {
        val redisTemplate = RedisTemplate<String, Any>()
        val serializer = redisSerializer()
        redisTemplate.connectionFactory = redisConnectionFactory
        redisTemplate.keySerializer = StringRedisSerializer()
        redisTemplate.valueSerializer = serializer
        redisTemplate.hashKeySerializer = StringRedisSerializer()
        redisTemplate.hashValueSerializer = serializer
        redisTemplate.afterPropertiesSet()
        return redisTemplate
    }

    @Bean
    fun redisSerializer(): RedisSerializer<Any> {
        val timeModule = JavaTimeModule().apply {
            val formatter = DateTimeFormatter.ISO_DATE_TIME
            addSerializer(LocalDateTime::class.java, LocalDateTimeSerializer(formatter))
            addDeserializer(LocalDateTime::class.java, LocalDateTimeDeserializer(formatter))
        }
        val objectMapper = jacksonObjectMapper().registerModules(timeModule)
        objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY)
        objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.EVERYTHING)
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        return Jackson2JsonRedisSerializer(objectMapper, Any::class.java)
    }

    @Bean
    fun redisCacheManager(
        serializer: RedisSerializer<Any>,
        redisConnectionFactory: RedisConnectionFactory,
    ): RedisCacheManager {
        val config = RedisCacheConfiguration.defaultCacheConfig()
            .computePrefixWith { name -> "$name:" }
            .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer))
        return object : RedisCacheManager(
            RedisCacheWriter.nonLockingRedisCacheWriter(redisConnectionFactory),
            config, true,
        ) {
            override fun createRedisCache(name: String, redisCacheConfiguration: RedisCacheConfiguration?): RedisCache {
                val (cacheName, expire) = name.split('+')
                val duration = Duration.parseOrNull(expire) ?: 24.hours
                return super.createRedisCache(cacheName, config.entryTtl(duration.toJavaDuration()))
            }
        }
    }
}
