package com.tzdig.framework.security.aspect

import cn.dev33.satoken.annotation.handler.SaAnnotationHandlerInterface
import cn.dev33.satoken.stp.StpUtil
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.security.annotation.SaCheckRoot
import org.springframework.stereotype.Component
import java.lang.reflect.Method

@Component
class SaCheckRootHandler : SaAnnotationHandlerInterface<SaCheckRoot> {
    override fun getHandlerAnnotationClass() = SaCheckRoot::class.java
    override fun checkMethod(at: SaCheckRoot, method: Method) =
        StpUtil.checkRole(SystemRole.ROOT)
}
