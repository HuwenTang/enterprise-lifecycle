package com.tzdig.framework.web.config

import cn.dev33.satoken.same.SaSameUtil
import cn.dev33.satoken.stp.StpUtil
import feign.RequestInterceptor
import feign.RequestTemplate
import org.springframework.context.annotation.Configuration

@Configuration
class SameTokenRequestInterceptor : RequestInterceptor {
    override fun apply(requestTemplate: RequestTemplate) {
        requestTemplate.header(SaSameUtil.SAME_TOKEN, SaSameUtil.getToken())
        requestTemplate.header(StpUtil.getTokenName(), StpUtil.getTokenValue())
    }
}
