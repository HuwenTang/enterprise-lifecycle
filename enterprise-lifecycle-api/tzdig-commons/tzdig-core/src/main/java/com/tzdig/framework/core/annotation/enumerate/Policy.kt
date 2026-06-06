package com.tzdig.framework.core.annotation.enumerate

enum class Policy {
    /**
     * 阻塞获取锁
     */
    BLOCKING,

    /**
     * 非阻塞获取锁，如果获取锁失败则返回null
     */
    NON_BLOCKING,

    /**
     * 严格模式，如果获取锁失败则抛出异常
     */
    STRICT,
}
