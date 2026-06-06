package com.tzdig.framework.model.vo

data class CascadeVO<T : Any>(
    val value: T?,
    val label: String,
    var children: List<CascadeVO<T>> = emptyList(),
) {
    @Suppress("unused")
    val key get() = value

    @Suppress("unused")
    val title get() = label
}
