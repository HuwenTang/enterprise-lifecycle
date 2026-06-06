package com.tzdig.framework.web.service

import com.tzdig.framework.web.annotation.Log
import org.aspectj.lang.JoinPoint

interface LogService {
    fun processBefore()
    fun processReturning(log: Log, joinPoint: JoinPoint, result: Any?)
    fun processThrowing(log: Log, joinPoint: JoinPoint, e: Throwable)
}
