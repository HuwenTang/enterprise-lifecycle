package com.tzdig.framework

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PrimeApplication

fun main(args: Array<String>) {
    runApplication<PrimeApplication>(*args)
}
