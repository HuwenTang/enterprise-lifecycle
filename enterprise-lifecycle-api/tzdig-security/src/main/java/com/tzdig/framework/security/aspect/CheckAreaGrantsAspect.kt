package com.tzdig.framework.security.aspect

import cn.dev33.satoken.annotation.handler.SaAnnotationHandlerInterface
import cn.dev33.satoken.exception.NotPermissionException
import com.tzdig.framework.security.annotation.CheckAreaGrants
import com.tzdig.framework.security.util.DataGrantsUtils
import org.springframework.stereotype.Component
import java.lang.reflect.Method

@Component
class CheckAreaGrantsAspect : SaAnnotationHandlerInterface<CheckAreaGrants> {
    override fun getHandlerAnnotationClass() = CheckAreaGrants::class.java
    override fun checkMethod(at: CheckAreaGrants, method: Method) {
        val grantedAreas = DataGrantsUtils.grantedAreas
        for (areaId in at.areaId)
            if (areaId !in grantedAreas)
                throw NotPermissionException(areaId)
    }
}
