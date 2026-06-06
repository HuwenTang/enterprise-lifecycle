package com.tzdig.framework.file.model

data class PutObjectResponse(
    val eTag: String? = null,
    val versionId: String? = null,
)
