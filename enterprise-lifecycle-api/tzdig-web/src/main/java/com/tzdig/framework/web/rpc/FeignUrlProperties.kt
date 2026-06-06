package com.tzdig.framework.web.rpc

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties("feign")
class FeignUrlProperties {
    var systemApi: String = ""
    var primeApi: String = ""
    var openApi: String = ""
}