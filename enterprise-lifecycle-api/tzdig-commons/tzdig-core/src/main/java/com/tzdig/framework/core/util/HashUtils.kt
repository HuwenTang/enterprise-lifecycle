package com.tzdig.framework.core.util

import org.bouncycastle.jcajce.provider.digest.MD5
import org.bouncycastle.jcajce.provider.digest.SHA1
import org.bouncycastle.jcajce.provider.digest.SHA256
import org.bouncycastle.jcajce.provider.digest.SM3
import org.bouncycastle.util.encoders.Hex
import java.io.InputStream
import java.security.MessageDigest

private fun MessageDigest.hash(inputStream: InputStream): ByteArray {
    var len: Int
    val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
    val fis = inputStream.buffered()
    try {
        while (fis.read(buffer).also { len = it } != -1) {
            update(buffer, 0, len)
        }
    } finally {
        if (fis !== inputStream) {
            runCatching { fis.close() }
        }
    }
    return digest()
}

fun InputStream.md5(): String = use {
    MD5.Digest()
        .hash(this)
        .let(Hex::toHexString)
}

fun InputStream.sha1(): String = use {
    SHA1.Digest()
        .hash(this)
        .let(Hex::toHexString)
}

fun InputStream.sha256(): String = use {
    SHA256.Digest()
        .hash(this)
        .let(Hex::toHexString)
}

fun InputStream.sm3(): String = use {
    SM3.Digest()
        .hash(this)
        .let(Hex::toHexString)
}

fun ByteArray.md5(): String = inputStream().md5()

fun ByteArray.sha1(): String = inputStream().sha1()

fun ByteArray.sha256(): String = inputStream().sha256()

fun ByteArray.sm3(): String = inputStream().sm3()
