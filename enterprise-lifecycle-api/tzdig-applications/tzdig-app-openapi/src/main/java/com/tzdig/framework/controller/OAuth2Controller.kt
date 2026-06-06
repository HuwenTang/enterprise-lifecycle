package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaIgnore
import cn.dev33.satoken.oauth2.annotation.SaCheckAccessToken
import cn.dev33.satoken.oauth2.processor.SaOAuth2ServerProcessor
import com.tzdig.framework.core.constant.ScopeConstant
import com.tzdig.framework.model.vo.UserinfoVO
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.util.StpUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@SaIgnore
@Tag(name = "OAuth2.0")
@RestController
@RequestMapping("oauth2")
class OAuth2Controller(
    private val userService: UserService,
) {
    @Operation(hidden = true)
    @RequestMapping("*")
    fun request(): Any? = SaOAuth2ServerProcessor.instance.dister()

    @SaCheckAccessToken(scope = [ScopeConstant.USERINFO])
    @Operation(summary = "查询用户信息")
    @GetMapping("userinfo")
    fun userinfo(): UserinfoVO {
        val user = userService.getUserAccountById(StpUtils.loginId)!!
        val dept = userService.getCobsByUserid(StpUtils.loginId).firstOrNull()
        return UserinfoVO(user, dept)
    }
}
