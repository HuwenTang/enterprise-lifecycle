package com.tzdig.framework.core.config

import com.tzdig.framework.core.util.AbstractThreadPool
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.scheduling.TaskScheduler
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler
import java.util.concurrent.Executor

@Configuration
@EnableAsync
@EnableScheduling
@Profile("prd")
class AsyncConfig {
    @Bean
    fun taskExecutor(): Executor {
        val executor = ThreadPoolTaskExecutor()
        executor.corePoolSize = AbstractThreadPool.availableProcessors + 1
        executor.maxPoolSize = AbstractThreadPool.availableProcessors * 2
        executor.queueCapacity = 100
        executor.setThreadNamePrefix("async-task-")
        executor.initialize()
        return executor
    }

    @Bean
    fun taskScheduler(): TaskScheduler {
        val scheduler = ThreadPoolTaskScheduler()
        scheduler.poolSize = AbstractThreadPool.availableProcessors + 1
        scheduler.setThreadNamePrefix("scheduled-task-")
        scheduler.initialize()
        return scheduler
    }
}
