package com.tzdig.framework.web.annotation.processor

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import com.tzdig.framework.web.annotation.JsonLabel
import com.tzdig.framework.web.util.DictUtils
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.findAnnotation

class JsonLabelProcessor : JsonSerializer<String>() {
    override fun serialize(
        value: String?,
        gen: JsonGenerator,
        serializers: SerializerProvider,
    ) {
        if (value == null) return gen.writeNull()
        val catalog = gen.currentValue()::class
            .declaredMemberProperties
            .find { it.name == gen.outputContext.currentName }!!
            .getter
            .findAnnotation<JsonLabel>()!!
            .catalog
        val label = DictUtils.getDictLabelByCode(catalog, value)
        gen.writeString(label)
    }
}
