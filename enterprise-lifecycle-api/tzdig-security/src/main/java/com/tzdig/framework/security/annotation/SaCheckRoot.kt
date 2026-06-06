package com.tzdig.framework.security.annotation

import cn.dev33.satoken.annotation.SaCheckRole
import com.tzdig.framework.core.constant.SystemRole

@SaCheckRole(SystemRole.ROOT)
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class SaCheckRoot
