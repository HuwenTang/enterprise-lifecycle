package com.tzdig.framework.security.util

import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.CacheConstants
import com.tzdig.framework.mybatis.entity.system.UserAreaGrants
import com.tzdig.framework.security.extension.userAccount
import jakarta.annotation.Resource
import org.springframework.beans.factory.InitializingBean
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component

@Component
class DataGrantsUtils : InitializingBean {
    @Lazy
    @Resource
    private lateinit var `this`: DataGrantsUtils

    override fun afterPropertiesSet() {
        Companion.`this` = `this`
    }

    @Cacheable(CacheConstants.USER_DATA_GRANTS, key = "#userid")
    fun getGrantedAreas(userid: String): Set<String> =
        query<UserAreaGrants> {
            where(UserAreaGrants::userid eq userid)
            and(UserAreaGrants::active eq true)
        }
            .mapNotNull { it.areaId }
            .toSet()

    @CachePut(CacheConstants.USER_DATA_GRANTS, key = "#userid")
    fun flushCache(userid: String): Set<String> =
        query<UserAreaGrants> {
            where(UserAreaGrants::userid eq userid)
            and(UserAreaGrants::active eq true)
        }
            .mapNotNull { it.areaId }
            .toSet()

    @CachePut(CacheConstants.USER_DATA_GRANTS, key = "#userid")
    fun flushCache(userid: String, list: Collection<String>): Set<String> =
        list.toSet()

    companion object {
        private lateinit var `this`: DataGrantsUtils

        @JvmStatic
        val grantedAreas: Set<String>
            get() = `this`.getGrantedAreas(userAccount.id!!)

        @JvmStatic
        fun hasGrantedArea(areaId: String): Boolean =
            areaId in grantedAreas

        @JvmStatic
        fun hasAnyGrantedArea(vararg areaIds: String): Boolean =
            areaIds.any { it in grantedAreas }
    }
}
