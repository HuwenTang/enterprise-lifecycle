package com.tzdig.framework.model.vo

typealias KVPairList<T> = List<KVPairVO<T>>

data class KVPairVO<T : Any>(
    val value: T,
    val label: String,
) {
    @Suppress("unused")
    val key get() = value

    @Suppress("unused")
    val title get() = label
}

