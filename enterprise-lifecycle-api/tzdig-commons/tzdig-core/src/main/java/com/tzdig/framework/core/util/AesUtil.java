package com.tzdig.framework.core.util;


import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

/**
 * 对称加密算法AES的实现
 * 采用了偏移向量iv
 *
 */
public class AesUtil {

    private static final String ALGORITHM = "AES";
    private static final String IV_ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final String DEFAULT_CHARSET = "UTF-8";

    /**
     * 生成秘钥
     *
     * @return
     * @throws NoSuchAlgorithmException
     */
    public static String generaterKey() throws NoSuchAlgorithmException {
        KeyGenerator keygen = KeyGenerator.getInstance(ALGORITHM);
        keygen.init(128, new SecureRandom()); // 16 字节 == 128 bit
        SecretKey secretKey = keygen.generateKey();
        return Base64.encodeBase64String(secretKey.getEncoded());
    }

    public static String generaterIV() {
        return RandomStringUtils.random(16, "0123456789abcdefghijklmnopqrstuvwxyz");
    }

    /**
     *
     */
    public static SecretKeySpec getSecretKeySpec(String secretKeyStr) {
        byte[] secretKey = Base64.decodeBase64(secretKeyStr);
        return new SecretKeySpec(secretKey, ALGORITHM);
    }

    /**
     * 加密
     */
    public static String encrypt(String content, String secretKey, String ivParameterSpec) throws Exception {
        if (content == null) {
            content = "";
        }
        Key key = getSecretKeySpec(secretKey);
        Cipher cipher = Cipher.getInstance(IV_ALGORITHM);// 创建密码器
        IvParameterSpec iv = new IvParameterSpec(ivParameterSpec.getBytes());
        cipher.init(Cipher.ENCRYPT_MODE, key, iv);// 初始化
        byte[] result = cipher.doFinal(content.getBytes(DEFAULT_CHARSET));
        return Base64.encodeBase64String(result);
    }


    /**
     * 解密
     */
    public static String decrypt(String content, String secretKey, String ivParameterSpec) throws Exception {
        if (StringUtils.isNotBlank(content)) {
            Key key = getSecretKeySpec(secretKey);
            Cipher cipher = Cipher.getInstance(IV_ALGORITHM);
            IvParameterSpec iv = new IvParameterSpec(ivParameterSpec.getBytes());
            cipher.init(Cipher.DECRYPT_MODE, key, iv);
            byte[] result = cipher.doFinal(Base64.decodeBase64(content));
            return new String(result, StandardCharsets.UTF_8);
        }
        return "";
    }
}
