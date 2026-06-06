package com.tzdig.framework.controller

import cn.dev33.satoken.annotation.SaCheckLogin
import cn.dev33.satoken.annotation.SaIgnore
import cn.dev33.satoken.stp.StpUtil
import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.core.util.sha1
import com.tzdig.framework.model.dto.ChangePasswordDTO
import com.tzdig.framework.model.dto.LoginDTO
import com.tzdig.framework.model.vo.ExtHlwjgOrgVO
import com.tzdig.framework.model.vo.OrganizationVO
import com.tzdig.framework.model.vo.SessionVO
import com.tzdig.framework.model.vo.hlwVO
import com.tzdig.framework.mybatis.entity.prime.ExtHlwJgOrg
import com.tzdig.framework.security.extension.organizationIds
import com.tzdig.framework.security.extension.userAccount
import com.tzdig.framework.security.extension.userAccountOrNull
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.service.LoginService
import com.tzdig.framework.web.annotation.Log
import com.tzdig.framework.web.annotation.LogType
import com.tzdig.framework.web.exception.ApiException
import com.tzdig.framework.web.exception.UnauthorizedException
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*


@Tag(name = "用户登录")
@RestController
@RequestMapping("/sso")
class SsoController(
    private val userService: UserService,
    private val loginService: LoginService,
) {
    @SaCheckLogin
    @Operation(summary = "登录信息")
    @GetMapping("session")
    fun getSession(): SessionVO {
        val userAccount = userAccount
        val organizations = userAccount.organizationIds
            .mapNotNull { userService.getUserOrganizationById(it) }
            .map { organization ->
                val cob = organization.cob?.let { userService.getUserOrganizationById(it) }
                OrganizationVO(organization, cob?.id, cob?.name)
            }
        return SessionVO(userAccount, organizations)
    }

    @SaIgnore
    @Log("用户管理/登录", type = LogType.SESSION)
    @Operation(summary = "用户登录")
    @PostMapping("session")
    fun login(@RequestBody dto: LoginDTO): SessionVO = when (dto.grantType) {
        "taizhengtong" -> loginService.loginWithTaizhengtong(dto)
        "taizhoutong" -> loginService.loginWithTaizhoutong(dto)
        else -> loginService.loginWithPassword(dto)
    }

    @SaIgnore
    @Log("用户管理/退出", type = LogType.SESSION)
    @Operation(summary = "退出登录")
    @DeleteMapping("session")
    fun logout() {
        StpUtil.logout()
        userAccountOrNull?.let { userService.removeCache(it) }
    }

    @SaCheckLogin
    @Log("用户管理/修改密码", type = LogType.SESSION)
    @Operation(summary = "修改密码")
    @PatchMapping("password")
    fun changePassword(
        @RequestBody dto: ChangePasswordDTO,
    ) {
        val userAccount = userAccount
        val password = "${userAccount.id}+${dto.oldPassword}".toByteArray().sha1()
        if (userAccount.password != password) throw ApiException("原密码错误")
        userAccount.password = "${userAccount.id}+${dto.newPassword}".toByteArray().sha1()
        userAccount.updateById()
        userService.updateCache(userAccount)
        StpUtil.logout()
        throw UnauthorizedException
    }

    @SaCheckLogin
    @Operation(summary = "生成ticket")
    @GetMapping("ticket")
    fun getTicket(): String {
        return StpUtil.getTokenValue()
    }

    @SaIgnore
    @Operation(summary = "ticket获取用户信息for互联网+监管")
    @GetMapping("session/{ticket}")
    fun getUserByTicket(@PathVariable ticket: String): hlwVO? {
        val loginId = StpUtil.getLoginIdByToken(ticket) as? String
            ?: throw ApiException("用户不存在")
        val userAccount = userService.getUserAccountById(loginId)
            ?: throw ApiException("用户不存在")
        val cobs = userService.getCobsByUserid(userAccount.id!!)
        if (cobs.isEmpty()) return hlwVO(userAccount, emptyList())
        val hlwOrgs = filter<ExtHlwJgOrg> { ExtHlwJgOrg::tgovtId inList cobs }.map { ExtHlwjgOrgVO(it) }
        return hlwVO(userAccount, hlwOrgs)
    }
}
