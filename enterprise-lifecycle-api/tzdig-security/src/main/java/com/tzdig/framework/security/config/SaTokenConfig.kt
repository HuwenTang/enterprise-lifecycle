package com.tzdig.framework.security.config

import cn.dev33.satoken.interceptor.SaInterceptor
import cn.dev33.satoken.stp.StpUtil
import org.springframework.boot.autoconfigure.web.ServerProperties
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class SaTokenConfig(
    private val serverProperties: ServerProperties,
) : WebMvcConfigurer {
    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(SaInterceptor {
            if (serverProperties.servlet.contextPath != "/openapi")
                StpUtil.checkLogin()
        })
            .addPathPatterns("/**")
            .excludePathPatterns("/actuator/**")
            .excludePathPatterns("/v3/api-docs")
            .excludePathPatterns("/file", "/file/**", "/tmp/download/**")
    }
}
