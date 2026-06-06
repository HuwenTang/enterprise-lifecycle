package com.tzdig.framework.util

import com.tzdig.framework.file.service.S3Service

object ZsxtS3TransformUtil {
    @JvmStatic
    fun transform(path: String?, s3Service: S3Service): String? {
        if (path.isNullOrEmpty()) return path
        val cleanPath = path.substringBefore('?').substringBefore('#')
        val filename = path.substringAfterLast('#', "")
        val url = if (cleanPath.isEmpty()) {
            cleanPath
        } else {
            s3Service.getSignedObjectUrl(
                cleanPath,
                disposition = S3Service.Disposition.ATTACHMENT,
                filename = filename,
            ) ?: cleanPath
        }
        return "$url#$filename"
    }
}
