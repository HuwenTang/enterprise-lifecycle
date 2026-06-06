package com.tzdig.framework.core.util

@Suppress("unused")
object ThreadPoolUtils : AbstractThreadPool(
    corePoolSize = availableProcessors + 1,
    maximumPoolSize = availableProcessors * 2,
)
