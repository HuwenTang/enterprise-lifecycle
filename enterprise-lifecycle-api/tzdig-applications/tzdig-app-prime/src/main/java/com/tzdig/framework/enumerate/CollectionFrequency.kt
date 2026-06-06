package com.tzdig.framework.enumerate

enum class CollectionFrequency {
    QUARTERLY,
    MONTHLY,
    WEEKLY;

    val value: String
        get() = name.lowercase()

    companion object {
        @JvmStatic
        fun parse(value: String) = entries.find { it.value == value }
    }
}
