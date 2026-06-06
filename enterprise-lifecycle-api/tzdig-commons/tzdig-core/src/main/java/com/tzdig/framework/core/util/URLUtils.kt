package com.tzdig.framework.core.util

import java.net.URLEncoder

val String.urlEncoded: String
    get() = URLEncoder.encode(this, Charsets.UTF_8).replace("+", "%20")
