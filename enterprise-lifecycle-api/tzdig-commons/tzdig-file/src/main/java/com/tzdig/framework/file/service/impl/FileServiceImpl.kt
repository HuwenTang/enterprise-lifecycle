package com.tzdig.framework.file.service.impl

import com.tzdig.framework.core.util.sha1
import com.tzdig.framework.core.util.urlEncoded
import com.tzdig.framework.file.model.ObjectMeta
import com.tzdig.framework.file.service.FileService
import com.tzdig.framework.file.service.S3Service
import org.apache.tika.Tika
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.core.io.InputStreamResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType.APPLICATION_OCTET_STREAM_VALUE
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
@ConditionalOnBean(S3Service::class)
class FileServiceImpl(
    private val s3Service: S3Service,
) : FileService {
    private val tika = Tika()
    override fun upload(file: MultipartFile): String {
        if (file.isEmpty) {
            throw IllegalStateException("Empty file.")
        }
        val sha1 = file.inputStream.sha1()
        val ext = file.originalFilename?.substringAfterLast('.')?.let { ".$it" }
        val name = "${sha1.substring(4, 10)}/${sha1}${ext}"
        val meta = s3Service.getObjectMeta("file/$name")
        if (meta?.contentType == null || meta.contentType != file.contentType) {
            val filename = file.originalFilename ?: ""
            s3Service.putObject(
                name = "file/$name",
                inputStream = file.inputStream,
                metadata = ObjectMeta(
                    contentType = file.contentType,
                    userMeta = mutableMapOf(
                        "original-filename" to filename.urlEncoded,
                    )
                )
            )
        }
        return name
    }

    override fun download(
        name: String,
        ifNoneMatch: String?,
    ): ResponseEntity<Resource> {
        val meta = s3Service.getObjectMeta("file/$name")
        if (meta == null) {
            return ResponseEntity.notFound().build()
        }
        val contentType = meta.contentType
        val filename = meta.userMeta["original-filename"]
        val disposition = "inline; filename=\"$filename\""
        if (ifNoneMatch == "\"${meta.eTag}\"") {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
                .header(HttpHeaders.ETAG, meta.eTag)
                .build()
        }
        val resource = InputStreamResource(s3Service.getObject("file/$name")!!)
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, contentType)
            .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
            .header(HttpHeaders.ETAG, meta.eTag)
            .body(resource)
    }

    override fun checkMimeType(file: MultipartFile): Boolean {
        val mimeType = tika.detect(file.inputStream)
        val isOffice = mimeType in arrayOf("application/zip", "application/x-tika-ooxml")
        val contentType = file.contentType ?: APPLICATION_OCTET_STREAM_VALUE
        if (isOffice && contentType.startsWith("application/vnd.openxmlformats-officedocument"))
            return true
        return mimeType.startsWith(contentType)
    }
}
