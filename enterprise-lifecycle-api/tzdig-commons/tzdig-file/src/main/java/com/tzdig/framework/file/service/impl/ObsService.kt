package com.tzdig.framework.file.service.impl

import com.obs.services.ObsClient
import com.obs.services.exception.ObsException
import com.obs.services.model.HttpMethodEnum
import com.obs.services.model.ObjectMetadata
import com.obs.services.model.TemporarySignatureRequest
import com.tzdig.framework.file.model.ObjectMeta
import com.tzdig.framework.file.model.PutObjectResponse
import com.tzdig.framework.file.properties.S3Properties
import com.tzdig.framework.file.service.S3Service
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass
import java.io.InputStream
import kotlin.time.Duration
import kotlin.time.DurationUnit

@ConditionalOnClass(ObsClient::class)
class ObsService(
    properties: S3Properties,
) : S3Service {
    private val bucket = properties.bucket
    private val client = ObsClient(
        properties.accessKey,
        properties.secretKey,
        properties.endpoint,
    )

    override fun putObject(
        name: String,
        inputStream: InputStream,
        metadata: ObjectMeta?,
    ): PutObjectResponse = inputStream.use {
        val meta = ObjectMetadata()
        meta.contentType = metadata?.contentType
        metadata?.userMeta?.forEach { (k, v) ->
            meta.addUserMetadata(k, v)
        }
        val res = client.putObject(bucket, name, it, meta)
        PutObjectResponse(
            eTag = res.etag,
            versionId = res.versionId,
        )
    }

    override fun getObject(
        name: String,
    ): InputStream? = try {
        val obj = client.getObject(bucket, name)
        obj.objectContent
    } catch (_: ObsException) {
        null
    }

    override fun getObjectMeta(
        name: String,
    ): ObjectMeta? = try {
        val meta = client.getObjectMetadata(bucket, name)
        ObjectMeta(meta)
    } catch (_: ObsException) {
        null
    }

    override fun getSignedObjectUrl(
        name: String,
        disposition: S3Service.Disposition,
        filename: String,
        expire: Duration,
    ): String? = try {
        val originalFilename = getObjectMeta(name.trimStart('/'))?.userMeta?.get("original-filename")
        val request = TemporarySignatureRequest(
            HttpMethodEnum.GET,
            bucket,
            name.trimStart('/'),
            null,
            expire.toLong(DurationUnit.SECONDS),
            null,
        )
        if (filename.isNotEmpty()) {
            request.queryParams = mapOf(
                "response-content-disposition" to "${disposition.name.lowercase()}; filename=\"$filename\"",
            )
        } else if (originalFilename != null) {
            request.queryParams = mapOf(
                "response-content-disposition" to "${disposition.name.lowercase()}; filename=\"${originalFilename}\""
            )
        }
        val path = client.createTemporarySignature(request).signedUrl
            .substringAfter("/file/")
        "/file/$path"
        // Header[x-obs-meta-original-filename]
    } catch (_: ObsException) {
        null
    }

    override fun deleteObject(
        name: String,
    ) {
        client.deleteObject(bucket, name)
    }
}
