package com.tzdig.framework.file.config

import com.tzdig.framework.file.properties.S3Properties
import com.tzdig.framework.file.service.S3Service
import com.tzdig.framework.file.service.impl.MinioService
import com.tzdig.framework.file.service.impl.ObsService
import com.tzdig.framework.file.service.impl.OssService
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@ConditionalOnBean(S3Properties::class)
class S3Factory(
    private val properties: S3Properties,
) {
    @Bean
    @ConditionalOnMissingBean(S3Service::class)
    fun s3Service(): S3Service = when (properties.provider) {
        S3Properties.S3Provider.MINIO -> MinioService(properties)
        S3Properties.S3Provider.OSS -> OssService(properties)
        S3Properties.S3Provider.OBS -> ObsService(properties)
    }
}
