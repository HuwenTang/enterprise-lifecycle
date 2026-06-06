package com.tzdig.framework.mybatis.entity.system.scheduled.info

import org.springframework.scheduling.annotation.Scheduled
import java.util.concurrent.TimeUnit

data class ScheduledInfo(
    val cron: String,
    val zone: String,
    val fixedRate: Long,
    val fixedRateString: String,
    val fixedDelay: Long,
    val fixedDelayString: String,
    val initialDelay: Long,
    val initialDelayString: String,
    val timeUnit: TimeUnit,
    val scheduler: String,
) {
    constructor(scheduled: Scheduled) : this(
        cron = scheduled.cron,
        zone = scheduled.zone,
        fixedRate = scheduled.fixedRate,
        fixedRateString = scheduled.fixedRateString,
        fixedDelay = scheduled.fixedDelay,
        fixedDelayString = scheduled.fixedDelayString,
        initialDelay = scheduled.initialDelay,
        initialDelayString = scheduled.initialDelayString,
        timeUnit = scheduled.timeUnit,
        scheduler = scheduled.scheduler,
    )
}
