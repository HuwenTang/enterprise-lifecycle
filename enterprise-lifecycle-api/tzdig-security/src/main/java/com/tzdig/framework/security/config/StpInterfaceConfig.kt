package com.tzdig.framework.security.config

import cn.dev33.satoken.stp.StpInterface
import com.mybatisflex.kotlin.extensions.db.all
import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.mybatis.entity.system.UserPermission
import com.tzdig.framework.mybatis.entity.system.UserXPermission
import com.tzdig.framework.security.extension.roleIds
import com.tzdig.framework.security.service.UserService
import org.springframework.context.annotation.Configuration

@Configuration
class StpInterfaceConfig(
    private val userService: UserService,
) : StpInterface {
    override fun getRoleList(loginId: Any, loginType: String): List<String> {
        val userAccount = userService.getUserAccountById(loginId as String) ?: return emptyList()
        return userAccount.roleIds
    }

    override fun getPermissionList(loginId: Any, loginType: String): List<String> {
        val userAccount = userService.getUserAccountById(loginId as String) ?: return emptyList()
        return if (SystemRole.ROOT in userAccount.roleIds) {
            all<UserPermission>().map { it.code!! }
        } else {
            filter<UserXPermission> { UserXPermission::userid eq loginId }
                .map { it.permissionCode!! }
        }
    }
}
