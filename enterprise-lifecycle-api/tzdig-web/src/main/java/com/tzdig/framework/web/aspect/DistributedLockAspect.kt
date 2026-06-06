package com.tzdig.framework.web.aspect

import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.core.annotation.enumerate.Policy
import com.tzdig.framework.core.util.SpelExpressionUtils
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.redisson.api.RedissonClient
import org.springframework.dao.CannotAcquireLockException
import org.springframework.stereotype.Component

@Aspect
@Component
class DistributedLockAspect(
    private val redissonClient: RedissonClient,
) {
    @Around("@annotation(distributedLock)")
    @Throws(CannotAcquireLockException::class)
    fun execute(point: ProceedingJoinPoint, distributedLock: DistributedLock): Any? {
        val lockName = distributedLock.value.ifEmpty { point.signature.toLongString().substringAfterLast(' ') }
        val key = SpelExpressionUtils.evaluate(distributedLock.key, point) ?: distributedLock.key
        val lock = redissonClient.getLock("distributed-lock::${lockName}::${key}")
        if (distributedLock.policy == Policy.BLOCKING) {
            lock.lock()
        } else if (!lock.tryLock()) {
            if (distributedLock.policy == Policy.STRICT) {
                throw CannotAcquireLockException("获取锁失败")
            }
            return null
        }
        try {
            return point.proceed()
        } finally {
            lock.unlock()
        }
    }
}
