package com.tzdig.framework.security.annotation

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FUNCTION)
annotation class CheckAreaGrants(
    vararg val areaId: String,
)
