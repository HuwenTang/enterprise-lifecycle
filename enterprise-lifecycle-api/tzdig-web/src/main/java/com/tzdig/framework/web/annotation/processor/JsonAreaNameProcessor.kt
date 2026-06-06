package com.tzdig.framework.web.annotation.processor

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import com.tzdig.framework.web.service.AreaService

class JsonAreaNameProcessor(
    private val areaService: AreaService,
) : JsonSerializer<String>() {
    override fun serialize(
        value: String?,
        gen: JsonGenerator,
        serializers: SerializerProvider,
    ) {
        if (value == null) return gen.writeNull()
        val label = value.split(',')
            .joinToString(",") { areaService.getById(it)?.name ?: it }
        gen.writeString(label)
    }
}
