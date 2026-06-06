package com.tzdig.framework.sms.properties

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties("sms")
@ConditionalOnProperty("sms.username")
class SmsProperties {
    /**
     * API IP
     */
    var apiIp: String = "172.22.25.45"

    /**
     * API端口
     */
    var apiPort: Int = 8086

    /**
     * 用户名
     */
    var username: String = ""

    /**
     * 发送密码
     */
    var password: String = ""
}
