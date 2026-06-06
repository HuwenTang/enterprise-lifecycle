package com.tzdig.framework.file.service.impl

import com.tzdig.framework.file.model.ObjectMeta
import com.tzdig.framework.file.model.PutObjectResponse
import com.tzdig.framework.file.properties.S3Properties
import com.tzdig.framework.file.service.S3Service
import io.minio.*
import io.minio.errors.MinioException
import io.minio.http.Method
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass
import java.io.InputStream
import kotlin.time.Duration
import kotlin.time.DurationUnit

@ConditionalOnClass(MinioClient::class)
class MinioService(
    properties: S3Properties,
) : S3Service {
    private val bucket = properties.bucket
    private val client = MinioClient.builder()
        .endpoint(properties.endpoint)
        .credentials(properties.accessKey, properties.secretKey)
        .build()

    override fun putObject(
        name: String,
        inputStream: InputStream,
        metadata: ObjectMeta?,
    ): PutObjectResponse = inputStream.use {
        val args = PutObjectArgs.builder()
            .bucket(bucket)
            .`object`(name)
            .stream(inputStream, -1, 8 * 1024 * 1024)
            .also { if (!metadata?.contentType.isNullOrEmpty()) it.contentType(metadata.contentType) }
            .also { if (metadata?.userMeta != null) it.userMetadata(metadata.userMeta) }
            .build()
        val res = client.putObject(args)
        PutObjectResponse(
            eTag = res.etag(),
            versionId = res.versionId(),
        )
    }

    override fun getObject(
        name: String,
    ): InputStream? = try {
        val args = GetObjectArgs.builder()
            .bucket(bucket)
            .`object`(name)
            .build()
        client.getObject(args)
    } catch (_: MinioException) {
        null
    }

    override fun getObjectMeta(
        name: String,
    ): ObjectMeta? = try {
        val args = StatObjectArgs.builder()
            .bucket(bucket)
            .`object`(name)
            .build()
        val meta = client.statObject(args)
        ObjectMeta(meta)
    } catch (_: MinioException) {
        null
    }

    override fun getSignedObjectUrl(
        name: String,
        disposition: S3Service.Disposition,
        filename: String,
        expire: Duration,
    ): String? = try {
        val originalFilename = getObjectMeta(name)?.userMeta?.get("original-filename")
        val args = GetPresignedObjectUrlArgs.builder()
            .method(Method.GET)
            .bucket(bucket)
            .`object`(name.trimStart('/'))
            .expiry(expire.toInt(DurationUnit.SECONDS))
            .apply {
                if (filename.isNotEmpty()) extraQueryParams(
                    mapOf("response-content-disposition" to "${disposition.name.lowercase()}; filename=\"$filename\"")
                ) else if (originalFilename != null) extraQueryParams(
                    mapOf("response-content-disposition" to "${disposition.name.lowercase()}; filename=\"${originalFilename}\"")
                )
            }
            .build()
        val path = client.getPresignedObjectUrl(args)
            .substringAfter("/file/")
        "/file/$path"
        // Header[x-amz-meta-original-filename]
    } catch (_: MinioException) {
        null
    }

    override fun deleteObject(
        name: String,
    ) {
        val args = RemoveObjectArgs.builder()
            .bucket(bucket)
            .`object`(name)
            .build()
        client.removeObject(args)
    }
}
