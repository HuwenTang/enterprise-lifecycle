package com.tzdig.framework.tzt.properties

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties("taizhoutong")
class TaizhoutongProperties {
    var appid: String = ""
    var secret: String = ""

    @Value($$"${taizhoutong.sm2.public-key:}")
    var publicKey: String = ""

    @Value($$"${taizhoutong.sm2.private-key:}")
    var privateKey: String = ""
}
