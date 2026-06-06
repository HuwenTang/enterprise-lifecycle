package com.tzdig.framework.file.properties

import org.springframework.beans.factory.InitializingBean
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties("file")
class FileProperties : InitializingBean {
    var tempDownload: String = "/tmp/download"

    companion object {
        lateinit var tempDownload: String
            private set
    }

    override fun afterPropertiesSet() {
        Companion.tempDownload = tempDownload
    }
}
