package com.tzdig.framework.file.model


data class ObjectMeta(
    var contentType: String? = null,
    var contentLength: Long? = null,
    var eTag: String? = null,
    var lastModified: Long? = null,
    val userMeta: MutableMap<String, String> = mutableMapOf(),
) {
    constructor(meta: io.minio.StatObjectResponse) : this(
        contentType = meta.contentType(),
        contentLength = meta.size(),
        eTag = meta.etag(),
        lastModified = meta.lastModified().toEpochSecond() * 1000,
        userMeta = meta.userMetadata()
    )

    constructor(meta: com.aliyun.oss.model.ObjectMetadata) : this(
        contentType = meta.contentType,
        contentLength = meta.contentLength,
        eTag = meta.eTag,
        lastModified = meta.lastModified.time,
        userMeta = meta.userMetadata,
    )

    constructor(meta: com.obs.services.model.ObjectMetadata) : this(
        contentType = meta.contentType,
        contentLength = meta.contentLength,
        eTag = meta.etag,
        lastModified = meta.lastModified.time,
    ) {
        meta.allMetadata.forEach { (k, v) -> userMeta[k] = v.toString() }
    }
}
