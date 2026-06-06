package com.tzdig.framework.service

import java.time.LocalDate
import java.time.LocalDateTime

interface CalenderService {
    fun minusWorkdays(time: LocalDateTime, workdays: Int): LocalDateTime
    fun getWorkdaysBetween(startDate: LocalDate): Long
}
