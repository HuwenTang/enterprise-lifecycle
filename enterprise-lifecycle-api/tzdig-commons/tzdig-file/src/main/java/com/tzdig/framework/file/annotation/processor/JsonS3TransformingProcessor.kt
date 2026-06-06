package com.tzdig.framework.file.annotation.processor

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import com.tzdig.framework.file.model.vo.FileDownloadVO
import com.tzdig.framework.file.service.S3Service

class JsonS3TransformingProcessor(
    private val s3Service: S3Service,
) : JsonSerializer<List<FileDownloadVO>>() {
    override fun serialize(
        value: List<FileDownloadVO>?,
        gen: JsonGenerator,
        serializers: SerializerProvider,
    ) {
        if (value == null) return gen.writeNull()
        for (vo in value) {
            val uri = vo.path
            val path = uri.substringBefore('?').substringBefore('#')
            val filename = uri.substringAfterLast('#', "")
            val url = if (path.isEmpty()) path
            else s3Service.getSignedObjectUrl(path, filename = filename, disposition = S3Service.Disposition.INLINE)
                ?: path
            vo.path = "${url}#${filename}"
        }
        gen.writeObject(value)
    }
}
