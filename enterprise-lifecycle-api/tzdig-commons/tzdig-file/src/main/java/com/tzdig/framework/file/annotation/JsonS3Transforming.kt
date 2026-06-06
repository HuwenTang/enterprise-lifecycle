package com.tzdig.framework.file.annotation

import com.fasterxml.jackson.annotation.JacksonAnnotationsInside
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.tzdig.framework.file.annotation.processor.JsonS3TransformingProcessor

@JacksonAnnotationsInside
@JsonSerialize(using = JsonS3TransformingProcessor::class)
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class JsonS3Transforming
