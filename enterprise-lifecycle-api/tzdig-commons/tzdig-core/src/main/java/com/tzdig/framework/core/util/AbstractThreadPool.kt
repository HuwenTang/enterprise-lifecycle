package com.tzdig.framework.core.util

import java.util.concurrent.*

/**
 * 自定义线程池
 */
abstract class AbstractThreadPool(
    /**
     * 核心线程数量
     */
    corePoolSize: Int,
    /**
     * 最大线程数量
     */
    maximumPoolSize: Int,
    /**
     * 空闲时长(seconds)
     */
    keepAliveTime: Long = 10,
    /**
     * 阻塞队列容量
     */
    blockingQueueCapacity: Int = 100,
) : ThreadPoolExecutor(
    corePoolSize,
    maximumPoolSize,
    keepAliveTime,
    TimeUnit.SECONDS,
    LinkedBlockingQueue(blockingQueueCapacity),
    Executors.defaultThreadFactory(),
    DiscardPolicy()
) {
    fun <R> supplyAsync(block: () -> R): CompletableFuture<R> =
        CompletableFuture.supplyAsync(block, this)

    fun runAsync(block: () -> Unit): CompletableFuture<Void> =
        CompletableFuture.runAsync(block, this)

    companion object {
        val availableProcessors = Runtime.getRuntime().availableProcessors()
    }
}
