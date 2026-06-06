package com.tzdig.framework.core.util

import org.bouncycastle.jce.provider.BouncyCastleProvider
import org.bouncycastle.util.encoders.Hex
import java.security.Security
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec

class SM4Utils(
    private val secretKey: SecretKey,
) {
    val secret: String = secretKey.encoded.b64encoded

    constructor() : this(createSecretKey())
    constructor(secret: String) : this(secret.secretKey())

    fun encrypt(data: ByteArray): ByteArray {
        val cipher = Cipher.getInstance(TRANSFORMATION, "BC")
        cipher.init(Cipher.ENCRYPT_MODE, secretKey)
        return cipher.doFinal(data)
    }

    fun encryptToString(data: ByteArray): String =
        encrypt(data).let(Hex::toHexString)

    fun decrypt(data: ByteArray): ByteArray {
        val cipher = Cipher.getInstance(TRANSFORMATION, "BC")
        cipher.init(Cipher.DECRYPT_MODE, secretKey)
        return cipher.doFinal(data)
    }

    fun decryptFromString(data: String): ByteArray =
        decrypt(Hex.decode(data))

    companion object {
        init {
            Security.addProvider(BouncyCastleProvider())
        }

        private const val ALGORITHM = "SM4"
        private const val TRANSFORMATION = "SM4/ECB/PKCS5Padding"
        private fun String.secretKey(): SecretKey =
            SecretKeySpec(b64decoded, ALGORITHM)

        private fun createSecretKey(): SecretKey {
            val generator = KeyGenerator.getInstance(ALGORITHM, "BC")
            generator.init(128)
            return generator.generateKey()
        }
    }
}
