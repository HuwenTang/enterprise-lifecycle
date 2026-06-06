package com.tzdig.framework.core.config

import okhttp3.OkHttpClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OkHttpConfig {
    @Bean
    fun okhttpClient(): OkHttpClient = OkHttpClient()
}
