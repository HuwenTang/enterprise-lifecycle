package com.tzdig.framework.core.annotation

import com.tzdig.framework.core.annotation.enumerate.Policy

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FUNCTION)
annotation class DistributedLock(
    val value: String = "",
    val key: String = "NULL",
    val policy: Policy = Policy.BLOCKING
)
