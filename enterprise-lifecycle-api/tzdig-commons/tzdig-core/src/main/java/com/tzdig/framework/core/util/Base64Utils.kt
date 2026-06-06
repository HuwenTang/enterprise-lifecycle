package com.tzdig.framework.core.util

import kotlin.io.encoding.Base64

val ByteArray.b64encoded: String get() = Base64.encode(this)

val String.b64decoded: ByteArray get() = Base64.decode(this)
