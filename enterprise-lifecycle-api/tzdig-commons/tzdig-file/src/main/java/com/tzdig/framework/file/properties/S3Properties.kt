package com.tzdig.framework.file.properties

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties("s3")
@ConditionalOnProperty("s3.provider")
class S3Properties {
    lateinit var provider: S3Provider
    var endpoint: String? = null
    var accessKey: String? = null
    var secretKey: String? = null
    var bucket: String? = null

    enum class S3Provider {
        MINIO,
        OSS,
        OBS,
    }
}
