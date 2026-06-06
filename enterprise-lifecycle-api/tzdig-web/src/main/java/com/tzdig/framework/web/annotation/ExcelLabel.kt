package com.tzdig.framework.web.annotation

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FIELD)
annotation class ExcelLabel(
    val catalog: String,
)
