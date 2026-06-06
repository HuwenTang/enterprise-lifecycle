package com.tzdig.framework.core.annotation.processor

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import com.tzdig.framework.core.annotation.JsonDecimal
import java.math.BigDecimal
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.findAnnotation

class JsonDecimalProcessor : JsonSerializer<Number>() {
    override fun serialize(
        value: Number?,
        gen: JsonGenerator,
        serializers: SerializerProvider,
    ) {
        if (value == null) return gen.writeNull()
        val scale = gen.currentValue()::class
            .declaredMemberProperties
            .find { it.name == gen.outputContext.currentName }!!
            .getter
            .findAnnotation<JsonDecimal>()!!
        val formatted = BigDecimal(value.toString()).setScale(scale.scale, scale.roundingMode)
        gen.writeNumber(formatted)
    }
}
