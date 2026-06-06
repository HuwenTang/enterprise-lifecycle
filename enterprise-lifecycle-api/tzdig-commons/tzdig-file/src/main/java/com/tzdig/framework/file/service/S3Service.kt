package com.tzdig.framework.file.service

import com.tzdig.framework.file.model.ObjectMeta
import com.tzdig.framework.file.model.PutObjectResponse
import java.io.InputStream
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes

interface S3Service {
    fun putObject(
        name: String,
        inputStream: InputStream,
        metadata: ObjectMeta? = null,
    ): PutObjectResponse

    fun getObject(
        name: String,
    ): InputStream?

    fun getObjectMeta(
        name: String
    ): ObjectMeta?

    fun getSignedObjectUrl(
        name: String,
        disposition: Disposition = Disposition.ATTACHMENT,
        filename: String = "",
        expire: Duration = 30.minutes,
    ): String?

    fun deleteObject(
        name: String,
    )

    enum class Disposition {
        INLINE,
        ATTACHMENT,
    }
}
