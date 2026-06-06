package com.tzdig.framework.security.service

import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.mybatis.entity.system.UserOrganization
import com.tzdig.framework.mybatis.entity.system.UserRole

interface UserService {
    fun getUserAccountById(userId: String): UserAccount?
    fun updateCache(userAccount: UserAccount): UserAccount
    fun removeCache(userAccount: UserAccount): UserAccount
    fun getUserAccountByMobile(mobile: String): UserAccount?

    fun getUserOrganizationById(organizationId: String): UserOrganization?
    fun updateCache(userOrganization: UserOrganization): UserOrganization
    fun removeCache(userOrganization: UserOrganization): UserOrganization
    fun getOrganizationIdsByUserid(userid: String): List<String>
    fun getUserIdsByOrganization(organizationId: String): Set<String>
    fun getCobsByUserid(userid: String): Set<String>
    fun getUsersByCob(cob: String): Set<String>

    fun getUserRoleById(roleId: String): UserRole?
    fun updateCache(userRole: UserRole): UserRole
    fun removeCache(userRole: UserRole): UserRole
    fun getRoleIdsByUserid(userid: String): List<String>
    fun updateUserRoleCache(userid: String, roleIds: List<String>): List<String>
    fun getUserIdsByRole(roleId: String): Set<String>

    fun getUpperOrganizationIds(organizationId: String): List<String>
    fun getLowerOrganizationIds(organizationId: String): List<String>
    fun rebuildLowerOrganizationIdsCache(organizationId: String): List<String>

    fun getUserPermissionByUserid(userid: String): List<String>
    fun updateUserPermissionCache(userid: String, permissionCodeList: List<String>): List<String>
}
