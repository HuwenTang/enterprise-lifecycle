package com.tzdig.framework.security.service.impl

import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.core.constant.CacheConstants
import com.tzdig.framework.core.constant.SystemRole
import com.tzdig.framework.mybatis.entity.system.*
import com.tzdig.framework.security.service.UserService
import jakarta.annotation.Resource
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Service

@Service
class UserServiceImpl : UserService {
    @Lazy
    @Resource
    private lateinit var `this`: UserServiceImpl

    // UserAccount
    @Cacheable(CacheConstants.USER_ACCOUNT, key = "#userId")
    override fun getUserAccountById(userId: String): UserAccount? = queryOneById(userId)

    @CachePut(CacheConstants.USER_ACCOUNT, key = "#userAccount.id")
    override fun updateCache(userAccount: UserAccount) = userAccount

    @CacheEvict(CacheConstants.USER_ACCOUNT, key = "#userAccount.id")
    override fun removeCache(userAccount: UserAccount) = userAccount

    override fun getUserAccountByMobile(mobile: String): UserAccount? =
        filterOne<UserAccount> { UserAccount::mobile eq mobile }

    // UserOrganization
    @Cacheable(CacheConstants.USER_ORGANIZATION, key = "#organizationId")
    override fun getUserOrganizationById(organizationId: String): UserOrganization? = queryOneById(organizationId)

    @CachePut(CacheConstants.USER_ORGANIZATION, key = "#userOrganization.id")
    override fun updateCache(userOrganization: UserOrganization) = userOrganization

    @CacheEvict(CacheConstants.USER_ORGANIZATION, key = "#userOrganization.id")
    override fun removeCache(userOrganization: UserOrganization) = userOrganization

    @Cacheable(CacheConstants.USER_ORGANIZATIONS, key = "#userid")
    override fun getOrganizationIdsByUserid(userid: String) =
        filter<UserXOrganization> { UserXOrganization::userid eq userid }.map { it.organizationId!! }

    override fun getUserIdsByOrganization(organizationId: String): Set<String> =
        filter<UserXOrganization> { UserXOrganization::organizationId eq organizationId }
            .map { it.userid!! }
            .toSet()

    override fun getCobsByUserid(userid: String): Set<String> {
        if (userid == "00") return setOf("0")
        val organizationIds = `this`.getOrganizationIdsByUserid(userid)
        if (organizationIds.isEmpty()) return emptySet()
        return filter<UserOrganization> { UserOrganization::id inList organizationIds }
            .mapNotNull { it.cob }
            .toSet()
    }

    override fun getUsersByCob(cob: String): Set<String> {
        val organizationIds = filter<UserOrganization> { UserOrganization::cob eq cob }
            .map { it.id!! }
        if (organizationIds.isEmpty()) return emptySet()
        return filter<UserXOrganization> { UserXOrganization::organizationId inList organizationIds }
            .map { it.userid!! }
            .toSet()
    }

    // UserRole
    @Cacheable(CacheConstants.USER_ROLE, key = "#roleId")
    override fun getUserRoleById(roleId: String): UserRole? = queryOneById(roleId)

    @CachePut(CacheConstants.USER_ROLE, key = "#userRole.id")
    override fun updateCache(userRole: UserRole) = userRole

    @CacheEvict(CacheConstants.USER_ROLE, key = "#userRole.id")
    override fun removeCache(userRole: UserRole) = userRole

    @Cacheable(CacheConstants.USER_ROLES, key = "#userid")
    override fun getRoleIdsByUserid(userid: String): List<String> =
        filter<UserXRole> { UserXRole::userid eq userid }
            .map { it.roleId!! }
            .plus(SystemRole.DEFAULT)
            .toSet()
            .sorted()

    @CachePut(CacheConstants.USER_ROLES, key = "#userid")
    override fun updateUserRoleCache(userid: String, roleIds: List<String>) = roleIds + SystemRole.DEFAULT

    override fun getUserIdsByRole(roleId: String): Set<String> =
        filter<UserXRole> { UserXRole::roleId eq roleId }
            .map { it.userid!! }
            .toSet()

    //
    @Cacheable(CacheConstants.USER_ORGANIZATION_UPPER, key = "#organizationId")
    override fun getUpperOrganizationIds(organizationId: String): List<String> {
        val list = mutableListOf<String>()
        var orgId = organizationId
        while (true) {
            val org = `this`.getUserOrganizationById(orgId) ?: break
            list.add(org.id!!)
            orgId = org.parentId ?: break
        }
        return list
    }

    @Cacheable(CacheConstants.USER_ORGANIZATION_LOWER, key = "#organizationId")
    override fun getLowerOrganizationIds(organizationId: String): List<String> {
        val list = mutableListOf(organizationId)
        val children = filter<UserOrganization> { UserOrganization::parentId eq organizationId }
        val grandchildren = children.flatMap { `this`.getLowerOrganizationIds(it.id!!) }
        list.addAll(grandchildren)
        return list
    }

    @CachePut(CacheConstants.USER_ORGANIZATION_LOWER, key = "#organizationId")
    override fun rebuildLowerOrganizationIdsCache(organizationId: String): List<String> {
        val list = mutableListOf(organizationId)
        val children = filter<UserOrganization> { UserOrganization::parentId eq organizationId }
        val grandchildren = children.flatMap { `this`.rebuildLowerOrganizationIdsCache(it.id!!) }
        list.addAll(grandchildren)
        return list
    }

    @Cacheable(CacheConstants.USER_PERMISSION, key = "#userid")
    override fun getUserPermissionByUserid(userid: String): List<String> =
        filter<UserXPermission> { UserXPermission::userid eq userid }
            .map { it.permissionCode!! }
            .sorted()

    @CachePut(CacheConstants.USER_PERMISSION, key = "#userid")
    override fun updateUserPermissionCache(userid: String, permissionCodeList: List<String>): List<String> =
        permissionCodeList
}
