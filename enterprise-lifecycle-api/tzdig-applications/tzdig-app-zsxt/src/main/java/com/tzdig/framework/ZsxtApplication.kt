package com.tzdig.framework

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients

@SpringBootApplication
@EnableFeignClients
class ZsxtApplication

fun main(args: Array<String>) {
    runApplication<ZsxtApplication>(*args)
}
