package com.tzdig.framework.tzt.model

data class SignatureResult(
    val nonce: String,
    val timestamp: Long, // 或者 String，看您后续需要
    val signature: String, // 这里是最终的 hex 签名串
)
