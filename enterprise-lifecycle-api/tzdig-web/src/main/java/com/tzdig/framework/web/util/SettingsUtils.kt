package com.tzdig.framework.web.util

import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.CacheConstants
import com.tzdig.framework.mybatis.entity.system.SystemSetting
import jakarta.annotation.Resource
import org.springframework.beans.factory.InitializingBean
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component

@Component
class SettingsUtils : InitializingBean {
    @Lazy
    @Resource
    private lateinit var `this`: SettingsUtils

    override fun afterPropertiesSet() {
        Companion.`this` = `this`
    }

    @Cacheable(CacheConstants.SYSTEM_SETTINGS, key = "#name")
    fun get(name: String): String? {
        val record = queryOne<SystemSetting> {
            where(SystemSetting::name eq name)
        }
        return record?.value
    }

    @CacheEvict(CacheConstants.SYSTEM_SETTINGS, key = "#name")
    fun flushCache(name: String) = Unit

    companion object {
        private lateinit var `this`: SettingsUtils

        @JvmStatic
        @JvmName("GetDictCodeByLabel")
        operator fun get(name: String): String? = `this`.get(name)
    }
}
