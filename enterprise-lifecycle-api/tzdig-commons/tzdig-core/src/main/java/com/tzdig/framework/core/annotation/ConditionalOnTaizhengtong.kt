package com.tzdig.framework.core.annotation

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.CLASS)
@ConditionalOnProperty("taizhengtong.appid")
annotation class ConditionalOnTaizhengtong
