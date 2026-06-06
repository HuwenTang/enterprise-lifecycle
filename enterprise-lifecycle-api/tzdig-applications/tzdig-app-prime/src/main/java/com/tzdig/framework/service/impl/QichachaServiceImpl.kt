package com.tzdig.framework.service.impl

import com.alibaba.fastjson2.JSON
import com.alibaba.fastjson2.JSONObject
import com.tzdig.framework.core.util.AesUtil
import com.tzdig.framework.service.QichachaService
import com.tzdig.framework.web.exception.MessageException
import org.apache.commons.lang3.StringUtils
import org.springframework.stereotype.Service

@Service
class QichachaServiceImpl : QichachaService {
    private val AES_KEY = "jIMSui6A6zsTu2m00qHGEQ==" //通过该方法生成 AesUtil.generaterKey()
    private val AES_IV = "rda3c5ghtczo49qj" //通过该方法生成 AesUtil.generaterIV()
    private val TOKEN_EXPIRY_SEC = 5 //token的失效秒数

    private val ROLE_ADMIN = "admin"

    private val ROLE_STAFF = "staff"

    /**
     * 生成第三方加密Token
     * @param loginName
     * @param role
     * @param name
     * @param email
     * @return
     * @throws Exception
     */
    override fun generateToken(loginName: String?, role: String?, name: String?, email: String?): String {
        var role = role
        if (StringUtils.isBlank(loginName)) {
            throw MessageException("用户名或ID不能为空")
        }
        val result: MutableMap<String?, String?> = HashMap<String?, String?>()
        result["loginName"] = loginName
        if (StringUtils.isBlank(name)) {
            result["name"] = loginName
        } else {
            result["name"] = name
        }
        if (StringUtils.isNotBlank(role)) {
            if (!(ROLE_ADMIN == role || ROLE_STAFF == role)) {
                throw MessageException("角色不正确")
            }
        } else {
            role = ROLE_STAFF
        }
        result["role"] = role
        result["email"] = email ?: ""
        result["timespan"] = (System.currentTimeMillis() / 1000).toString()

        val content = JSON.toJSONString(result)
        return AesUtil.encrypt(content, AES_KEY, AES_IV)
    }

    /**
     * 解密Token
     * @param token
     * @return
     * @throws Exception
     */
    override fun decryptToken(token: String): JSONObject? {
        val content = AesUtil.decrypt(token, AES_KEY, AES_IV)
        val map = JSON.parseObject(content)
        val timespan = map.getLong("timespan")
        if (TOKEN_EXPIRY_SEC > 0 && ((System.currentTimeMillis() / 1000) - timespan > TOKEN_EXPIRY_SEC)) {
            throw MessageException("Token失效")
        }
        return map
    }
}
