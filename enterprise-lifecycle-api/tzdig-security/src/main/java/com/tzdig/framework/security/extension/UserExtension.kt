package com.tzdig.framework.security.extension

import cn.dev33.satoken.context.SaHolder
import com.tzdig.framework.core.util.SpringUtils
import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.security.service.UserService
import com.tzdig.framework.web.exception.UnauthorizedException

private val userService: UserService by lazy { SpringUtils.getBean() }

val userAccountOrNull: UserAccount?
    get() = SaHolder.getStorage().get("user.account") as? UserAccount

val userAccount: UserAccount
    get() = userAccountOrNull ?: throw UnauthorizedException

val UserAccount.organizationIds: List<String>
    get() = userService.getOrganizationIdsByUserid(id!!)

val UserAccount.roleIds: List<String>
    get() = userService.getRoleIdsByUserid(id!!)

fun UserAccount.hasRole(roleId: String): Boolean =
    roleIds.contains(roleId)

fun UserAccount.hasAnyRole(vararg roles: String): Boolean =
    roles.any { hasRole(it) }

fun UserAccount.hasAllRole(vararg roles: String): Boolean =
    roles.all { hasRole(it) }
