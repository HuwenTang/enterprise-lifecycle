package com.tzdig.framework.web.aspect

import com.tzdig.framework.web.annotation.Log
import com.tzdig.framework.web.service.LogService
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.AfterReturning
import org.aspectj.lang.annotation.AfterThrowing
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.springframework.stereotype.Component

@Aspect
@Component
class LogAspect(
    private val logService: LogService,
) {
    @Before("@annotation(log)")
    fun doBefore(log: Log) =
        logService.processBefore()

    @AfterReturning("@annotation(log)", returning = "result")
    fun doAfterReturning(joinPoint: JoinPoint, log: Log, result: Any?) =
        logService.processReturning(log, joinPoint, result)

    @AfterThrowing("@annotation(log)", throwing = "e")
    fun doAfterThrowing(joinPoint: JoinPoint, log: Log, e: Throwable) =
        logService.processThrowing(log, joinPoint, e)
}
