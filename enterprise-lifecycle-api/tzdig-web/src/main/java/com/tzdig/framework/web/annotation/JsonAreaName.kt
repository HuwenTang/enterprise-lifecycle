package com.tzdig.framework.web.annotation

import com.fasterxml.jackson.annotation.JacksonAnnotationsInside
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.tzdig.framework.web.annotation.processor.JsonAreaNameProcessor

@JacksonAnnotationsInside
@JsonSerialize(using = JsonAreaNameProcessor::class)
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class JsonAreaName
