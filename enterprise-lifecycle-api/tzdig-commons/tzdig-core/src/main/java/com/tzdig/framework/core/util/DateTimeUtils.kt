package com.tzdig.framework.core.util

import java.time.*

private val zone = ZoneOffset.ofHours(8)
fun Long.toInstant(): Instant =
    if (this > 1e10) {
        // 毫秒级时间戳
        Instant.ofEpochMilli(this)
    } else {
        // 秒级时间戳
        Instant.ofEpochSecond(this)
    }

fun Instant.toLocalDateTime(): LocalDateTime =
    atZone(zone).toLocalDateTime()

fun Instant.toLocalDate(): LocalDate =
    atZone(zone).toLocalDate()

fun Instant.toLocalTime(): LocalTime =
    atZone(zone).toLocalTime()
