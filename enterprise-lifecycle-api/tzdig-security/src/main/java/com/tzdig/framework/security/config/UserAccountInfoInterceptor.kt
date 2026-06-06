package com.tzdig.framework.security.config

import cn.dev33.satoken.context.SaHolder
import cn.dev33.satoken.stp.StpUtil
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.security.service.UserService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.web.servlet.HandlerInterceptor
import org.springframework.web.servlet.ModelAndView
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@Order(10)
class UserAccountInfoInterceptor(
    private val userService: UserService,
) : HandlerInterceptor, WebMvcConfigurer {
    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(this)
    }

    override fun preHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
    ): Boolean {
        if (StpUtil.isLogin()) {
            if (StpUtil.isLogin(SystemRole.ROOT)) {
                val userid = request.getHeader("X-User")
                if (!userid.isNullOrEmpty()) {
                    StpUtil.switchTo(userid)
                }
            }
            val userid = StpUtil.getLoginIdAsString()
            val userAccount = userService.getUserAccountById(userid)
            SaHolder.getStorage().set("user.account", userAccount)
        }
        return true
    }

    override fun postHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
        modelAndView: ModelAndView?,
    ) {
        StpUtil.endSwitch()
    }
}
