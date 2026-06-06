package com.tzdig.framework.core.util

import org.bouncycastle.asn1.gm.GMNamedCurves
import org.bouncycastle.crypto.CipherParameters
import org.bouncycastle.crypto.Digest
import org.bouncycastle.crypto.InvalidCipherTextException
import org.bouncycastle.crypto.digests.SM3Digest
import org.bouncycastle.crypto.params.*
import org.bouncycastle.math.ec.ECConstants
import org.bouncycastle.math.ec.ECFieldElement
import org.bouncycastle.math.ec.ECPoint
import org.bouncycastle.util.Arrays
import org.bouncycastle.util.BigIntegers
import org.bouncycastle.util.encoders.Hex
import java.math.BigInteger
import java.security.SecureRandom

class SM2Utils private constructor() {
    enum class CipherMode {
        C1C2C3, C1C3C2,
    }

    private lateinit var cipherMode: CipherMode
    private lateinit var ecParams: ECDomainParameters
    private lateinit var ecKey: ECKeyParameters
    private lateinit var random: SecureRandom
    private val digest: Digest = SM3Digest()
    private var curveLength: Int = 0

    /**
     * 默认初始化方法，使用国密排序标准
     *
     * @param forEncryption 是否以加密模式初始化
     * @param cipherMode    加密数据排列模式
     * @param param         曲线参数
     */
    private fun init(forEncryption: Boolean, cipherMode: CipherMode, param: CipherParameters) {
        this.cipherMode = cipherMode
        if (forEncryption) {
            val rParam = param as ParametersWithRandom
            ecKey = rParam.parameters as ECKeyParameters
            ecParams = ecKey.parameters
            val s = (ecKey as ECPublicKeyParameters).q.multiply(ecParams.h)
            if (s.isInfinity) {
                throw InvalidCipherTextException("[h]Q at infinity")
            }
            random = rParam.random
        } else {
            ecKey = param as ECKeyParameters
            ecParams = ecKey.parameters
        }
        curveLength = (ecParams.curve.fieldSize + 7) / 8
    }

    /**
     * 加密实现
     *
     * @param bytes 解密字节串
     * @return 加密字节串
     */
    private fun encrypt(bytes: ByteArray): ByteArray {
        val len = bytes.size
        val c2 = ByteArray(len)
        System.arraycopy(bytes, 0, c2, 0, c2.size)
        var c1: ByteArray?
        var kPB: ECPoint
        do {
            val k = nextK()
            val c1P = ecParams.g.multiply(k).normalize()
            c1 = c1P.getEncoded(false)
            kPB = (ecKey as ECPublicKeyParameters).q.multiply(k).normalize()
            kdf(digest, kPB, c2)
        } while (notEncrypted(c2, bytes[0]))
        val c3 = ByteArray(digest.digestSize)
        addFieldElement(digest, kPB.affineXCoord)
        digest.update(bytes, 0, len)
        addFieldElement(digest, kPB.affineYCoord)
        digest.doFinal(c3, 0)
        if (cipherMode == CipherMode.C1C3C2) {
            return Arrays.concatenate(c1, c3, c2)
        }
        return Arrays.concatenate(c1, c2, c3)
    }

    /**
     * 解密实现
     *
     * @param bytes 加密字符串
     * @return 解密字节串
     */
    private fun decrypt(bytes: ByteArray): ByteArray {
        val len = bytes.size
        val c1 = ByteArray(curveLength * 2 + 1)
        System.arraycopy(bytes, 0, c1, 0, c1.size)
        var c1P = ecParams.curve.decodePoint(c1)
        val s = c1P.multiply(ecParams.h)
        if (s.isInfinity) {
            throw InvalidCipherTextException("[h]C1 at infinity")
        }
        c1P = c1P.multiply((ecKey as ECPrivateKeyParameters).d).normalize()
        val c2 = ByteArray(len - c1.size - digest.digestSize)
        if (cipherMode == CipherMode.C1C2C3) {
            System.arraycopy(bytes, c1.size, c2, 0, c2.size)
        } else {
            System.arraycopy(bytes, c1.size + digest.digestSize, c2, 0, c2.size)
        }
        kdf(digest, c1P, c2)
        val c3 = ByteArray(digest.digestSize)
        addFieldElement(digest, c1P.affineXCoord)
        digest.update(c2, 0, c2.size)
        addFieldElement(digest, c1P.affineYCoord)
        digest.doFinal(c3, 0)
        var check = 0
        // 检查密文输入值C3部分和由摘要生成的C3是否一致
        if (cipherMode == CipherMode.C1C2C3) {
            for (i in c3.indices) {
                check = check or (c3[i].toInt() xor bytes[c1.size + c2.size + i].toInt())
            }
        } else {
            for (i in c3.indices) {
                check = check or (c3[i].toInt() xor bytes[c1.size + i].toInt())
            }
        }
        if (check != 0) {
            throw InvalidCipherTextException("invalid cipher text")
        }
        return c2
    }

    private fun notEncrypted(encData: ByteArray, byte: Byte): Boolean =
        encData.all { it == byte }

    private fun kdf(digest: Digest, c1: ECPoint, encData: ByteArray) {
        var ct = 1
        val v = digest.digestSize
        val buf = ByteArray(digest.digestSize)
        var off = 0
        (0..<((encData.size + v - 1) / v)).forEach {
            addFieldElement(digest, c1.affineXCoord)
            addFieldElement(digest, c1.affineYCoord)
            digest.update((ct shr 24).toByte())
            digest.update((ct shr 16).toByte())
            digest.update((ct shr 8).toByte())
            digest.update(ct.toByte())
            digest.doFinal(buf, 0)
            xor(encData, buf, off, minOf(buf.size, encData.size - off))
            off += buf.size
            ct++
        }
    }

    private fun xor(data: ByteArray, kdfOut: ByteArray, dOff: Int, dRemaining: Int) {
        for (i in 0 until dRemaining) {
            data[dOff + i] = (data[dOff + i].toInt() xor kdfOut[i].toInt()).toByte()
        }
    }

    private fun nextK(): BigInteger {
        val qBitLength = ecParams.n.bitLength()
        while (true) {
            val k = BigInteger(qBitLength, random)
            if (k != ECConstants.ZERO && k < ecParams.n)
                return k
        }
    }

    private fun addFieldElement(digest: Digest, v: ECFieldElement) =
        with(BigIntegers.asUnsignedByteArray(curveLength, v.toBigInteger())) {
            digest.update(this, 0, size)
        }

    companion object {
        /**
         * SM2加密算法
         *
         * @param publicKey 公钥
         * @param data      待加密的数据
         * @return 密文，BC库产生的密文带由04标识符，与非BC库对接时需要去掉开头的04
         */
        @JvmStatic
        @JvmOverloads
        fun encrypt(publicKey: String, data: String, cipherMode: CipherMode = CipherMode.C1C3C2): String {
            // 获取一条SM2曲线参数
            val sm2ECParameters = GMNamedCurves.getByName("sm2p256v1")
            // 构造ECC算法参数，曲线方程、椭圆曲线G点、大整数N
            val domainParameters =
                ECDomainParameters(sm2ECParameters.curve, sm2ECParameters.g, sm2ECParameters.n)
            //提取公钥点
            val pukPoint = sm2ECParameters.curve.decodePoint(Hex.decode(publicKey))
            // 公钥前面的02或者03表示是压缩公钥，04表示未压缩公钥, 04的时候，可以去掉前面的04
            val publicKeyParameters = ECPublicKeyParameters(pukPoint, domainParameters)
            val sm2Utils = SM2Utils()
            sm2Utils.init(true, cipherMode, ParametersWithRandom(publicKeyParameters, SecureRandom()))
            val bytes = data.toByteArray()
            val cipherData = sm2Utils.encrypt(bytes)
            return Hex.toHexString(cipherData)
        }

        /**
         * SM2解密算法
         *
         * @param privateKey 私钥
         * @param cipherData 密文数据
         * @return
         */
        @JvmStatic
        @JvmOverloads
        fun decrypt(privateKey: String, cipherData: String, cipherMode: CipherMode = CipherMode.C1C3C2): String {
            // 使用BC库加解密时密文以04开头，传入的密文前面没有04则补上
            var cipherData = cipherData
            if (!cipherData.startsWith("04")) {
                cipherData = "04$cipherData"
            }
            val cipherDataByte = Hex.decode(cipherData)
            //获取一条SM2曲线参数
            val sm2ECParameters = GMNamedCurves.getByName("sm2p256v1")
            //构造domain参数
            val domainParameters = ECDomainParameters(sm2ECParameters.curve, sm2ECParameters.g, sm2ECParameters.n)
            val privateKeyD = BigInteger(privateKey, 16)
            val privateKeyParameters = ECPrivateKeyParameters(privateKeyD, domainParameters)
            val sm2Utils = SM2Utils()
            // 设置sm2为解密模式
            sm2Utils.init(false, cipherMode, privateKeyParameters)
            val bytes = sm2Utils.decrypt(cipherDataByte)
            return bytes.toString(Charsets.UTF_8)
        }
    }
}
