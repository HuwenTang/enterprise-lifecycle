package com.tzdig.framework.file.annotation

import com.fasterxml.jackson.annotation.JsonIgnore
import com.tzdig.framework.file.service.S3Service.Disposition

interface S3Transformable {
    fun s3transform(transform: (String) -> String)

    @get:JsonIgnore
    val disposition: Disposition
        get() = Disposition.ATTACHMENT
}
