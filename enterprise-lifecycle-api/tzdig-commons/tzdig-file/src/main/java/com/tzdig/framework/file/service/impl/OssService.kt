package com.tzdig.framework.file.service.impl

import com.aliyun.oss.ClientConfiguration
import com.aliyun.oss.HttpMethod
import com.aliyun.oss.OSSClient
import com.aliyun.oss.OSSException
import com.aliyun.oss.common.auth.DefaultCredentialProvider
import com.aliyun.oss.model.GeneratePresignedUrlRequest
import com.aliyun.oss.model.ObjectMetadata
import com.tzdig.framework.file.model.ObjectMeta
import com.tzdig.framework.file.model.PutObjectResponse
import com.tzdig.framework.file.properties.S3Properties
import com.tzdig.framework.file.service.S3Service
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass
import java.io.InputStream
import java.util.*
import kotlin.time.Duration
import kotlin.time.DurationUnit

@ConditionalOnClass(OSSClient::class)
class OssService(
    properties: S3Properties,
) : S3Service {
    private val bucket = properties.bucket
    private val client = OSSClient(
        properties.endpoint,
        DefaultCredentialProvider(properties.accessKey, properties.secretKey, null),
        ClientConfiguration().setSupportCname(false),
    )

    override fun putObject(
        name: String,
        inputStream: InputStream,
        metadata: ObjectMeta?,
    ): PutObjectResponse = inputStream.use {
        val meta = ObjectMetadata()
        meta.contentType = metadata?.contentType
        meta.userMetadata = metadata?.userMeta
        val res = client.putObject(bucket, name, it, meta)
        try {
            res.response.close()
        } catch (_: Exception) {
        }
        PutObjectResponse(
            eTag = res.eTag,
            versionId = res.versionId,
        )
    }

    override fun getObject(
        name: String,
    ): InputStream? = try {
        val obj = client.getObject(bucket, name)
        obj.objectContent
    } catch (_: OSSException) {
        null
    }

    override fun getObjectMeta(
        name: String,
    ): ObjectMeta? = try {
        val meta = client.getObjectMetadata(bucket, name)
        ObjectMeta(meta)
    } catch (_: OSSException) {
        null
    }

    override fun getSignedObjectUrl(
        name: String,
        disposition: S3Service.Disposition,
        filename: String,
        expire: Duration,
    ): String? = try {
        val originalFilename = getObjectMeta(name)?.userMeta?.get("original-filename")
        val request = GeneratePresignedUrlRequest(bucket, name)
        request.method = HttpMethod.GET
        val expireAt = System.currentTimeMillis() + expire.toLong(DurationUnit.MILLISECONDS)
        request.expiration = Date(expireAt)
        if (filename.isNotEmpty()) {
            request.responseHeaders.contentDisposition =
                "${disposition.name.lowercase()}; filename=\"${filename}\""
        } else if (originalFilename != null) {
            request.responseHeaders.contentDisposition =
                "${disposition.name.lowercase()}; filename=\"${originalFilename}\""
        }
        val path = client.generatePresignedUrl(request).toString()
            .substringAfter("/file/")
        "/file/$path"
        // Header[x-oss-meta-original-filename]
    } catch (_: OSSException) {
        null
    }

    override fun deleteObject(
        name: String,
    ) {
        client.deleteObject(bucket, name)
    }
}
