package com.tzdig.framework.core.annotation

import com.fasterxml.jackson.annotation.JacksonAnnotationsInside
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.tzdig.framework.core.annotation.processor.JsonDecimalProcessor
import java.math.RoundingMode

@JacksonAnnotationsInside
@JsonSerialize(using = JsonDecimalProcessor::class)
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class JsonDecimal(
    val scale: Int,
    val roundingMode: RoundingMode = RoundingMode.HALF_UP,
)
