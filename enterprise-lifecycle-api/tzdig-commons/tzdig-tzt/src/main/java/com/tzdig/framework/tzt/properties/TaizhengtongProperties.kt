package com.tzdig.framework.tzt.properties

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties("taizhengtong")
class TaizhengtongProperties {
    var gid: String = "1572864"
    var appid: String = ""
    var secret: String = ""
    var staffTagForApp: String = ""
}
