package com.tzdig.framework.core.annotation

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FIELD)
annotation class ExcelOptions(
    val value: String,
)
