package com.tzdig.framework.service.impl

import cn.dev33.satoken.stp.StpUtil
import com.tzdig.framework.core.util.sha1
import com.tzdig.framework.model.dto.LoginDTO
import com.tzdig.framework.model.vo.OrganizationVO
import com.tzdig.framework.model.vo.SessionVO
import com.tzdig.framework.security.extension.organizationIds
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.service.LoginService
import com.tzdig.framework.tzt.service.TaizhengtongClient
import com.tzdig.framework.tzt.service.TaizhoutongClient
import com.tzdig.framework.web.exception.ApiException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class LoginServiceImpl(
    private val userService: UserService,
    private val taizhengtongClient: TaizhengtongClient,
    private val taizhoutongClient: TaizhoutongClient,
) : LoginService {
    private val logger = LoggerFactory.getLogger(javaClass)

    override fun loginWithPassword(dto: LoginDTO): SessionVO {
        val mobile = dto.mobile ?: throw ApiException("参数无效")
        val userAccount = userService.getUserAccountByMobile(mobile)
            ?: throw ApiException("用户名或密码错误")
        val password = "${userAccount.id}+${dto.password}".toByteArray().sha1()
        if (userAccount.password != password) {
            logger.debug("{} != {}", userAccount.password, password)
            throw ApiException("用户名或密码错误")
        }
        userAccount.lastLoginTime = LocalDateTime.now()
        userAccount.updateById()
        StpUtil.login(userAccount.id, dto.endpoint?.name)
        val organizations = userAccount.organizationIds
            .mapNotNull { userService.getUserOrganizationById(it) }
            .map { organization ->
                val cob = organization.cob?.let { userService.getUserOrganizationById(it) }
                OrganizationVO(organization, cob?.id, cob?.name)
            }
        return SessionVO(userAccount, organizations)
    }

    override fun loginWithTaizhengtong(dto: LoginDTO): SessionVO {
        val code = dto.code ?: throw ApiException("参数无效")
        val appToken = taizhengtongClient.getAppToken()
        val userToken = taizhengtongClient.getUserToken(appToken, code) ?: throw ApiException("登录失败")
        val mobile = taizhengtongClient.getMobile(appToken, userToken) ?: throw ApiException("登录失败")
        val userAccount = userService.getUserAccountByMobile(mobile)
            ?: throw ApiException("用户无权限")
        userAccount.lastLoginTime = LocalDateTime.now()
        userAccount.updateById()
        StpUtil.login(userAccount.id, dto.endpoint?.name)
        val organizations = userAccount.organizationIds
            .mapNotNull { userService.getUserOrganizationById(it) }
            .map { organization ->
                val cob = organization.cob?.let { userService.getUserOrganizationById(it) }
                OrganizationVO(organization, cob?.id, cob?.name)
            }
        return SessionVO(userAccount, organizations)
    }

    override fun loginWithTaizhoutong(dto: LoginDTO): SessionVO {
        val ticket = dto.ticket ?: throw ApiException("参数无效")
        val token = taizhoutongClient.getToken(ticket) ?: throw ApiException("登录失败")
        val mobile = taizhoutongClient.getMobile(token) ?: throw ApiException("登录失败")
        val userAccount = userService.getUserAccountByMobile(mobile)
            ?: throw ApiException("用户无权限")
        userAccount.lastLoginTime = LocalDateTime.now()
        userAccount.updateById()
        StpUtil.login(userAccount.id, dto.endpoint?.name)
        val organizations = userAccount.organizationIds
            .mapNotNull { userService.getUserOrganizationById(it) }
            .map { organization ->
                val cob = organization.cob?.let { userService.getUserOrganizationById(it) }
                OrganizationVO(organization, cob?.id, cob?.name)
            }
        return SessionVO(userAccount, organizations)
    }
}
