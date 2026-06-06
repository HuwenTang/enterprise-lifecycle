package com.tzdig.framework.core.util

val NUMBERS = ('0'..'9').toList()
val LETTERS = ('a'..'z').toList()
val CHARACTERS = NUMBERS + LETTERS

fun List<Char>.randomString(len: Int): String = with(StringBuilder()) {
    repeat(len) { append(this@randomString.random()) }
    toString()
}
