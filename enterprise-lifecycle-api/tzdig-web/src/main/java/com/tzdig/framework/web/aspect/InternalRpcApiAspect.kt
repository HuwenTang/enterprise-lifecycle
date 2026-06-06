package com.tzdig.framework.web.aspect

import cn.dev33.satoken.context.SaHolder
import cn.dev33.satoken.exception.NotImplException
import com.tzdig.framework.web.annotation.InternalRpcApi
import com.tzdig.framework.web.service.XTokenService
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.springframework.stereotype.Component

@Aspect
@Component
class InternalRpcApiAspect(
    private val xTokenService: XTokenService,
) {
    @Before("@annotation(internalRpcApi)")
    fun before(internalRpcApi: InternalRpcApi) {
        val tokenKey = SaHolder.getRequest()
            .getHeader("X-Token-Key")
        val tokenValue = SaHolder.getRequest()
            .getHeader("X-Token-Value")
        if (tokenKey.isNullOrEmpty() || tokenValue.isNullOrEmpty())
            throw NotImplException("Unknown Error")
        val res = xTokenService.verifyToken(tokenKey, tokenValue)
        if (!res) throw NotImplException("Unknown Error")
    }
}
