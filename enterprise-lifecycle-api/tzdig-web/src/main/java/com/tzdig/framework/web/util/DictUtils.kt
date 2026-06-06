package com.tzdig.framework.web.util

import com.mybatisflex.core.logicdelete.LogicDeleteManager
import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.tzdig.framework.core.constant.CacheConstants
import com.tzdig.framework.mybatis.entity.system.SystemDict
import jakarta.annotation.Resource
import org.springframework.beans.factory.InitializingBean
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component

@Component
class DictUtils : InitializingBean {
    @Lazy
    @Resource
    private lateinit var `this`: DictUtils

    override fun afterPropertiesSet() {
        Companion.`this` = `this`
    }

    @Cacheable(CacheConstants.SYSTEM_DICT, key = "#catalog + ':' + #label")
    fun getDictCodeByLabel(catalog: String, label: String): String {
        val record = queryOne<SystemDict> {
            where(SystemDict::catalog eq catalog)
            and(SystemDict::label eq label)
        }
        return record?.code ?: label
    }

    @Cacheable(CacheConstants.SYSTEM_DICT, key = "#catalog + ':' + #code")
    fun getDictLabelByCode(catalog: String, code: String): String {
        val record = LogicDeleteManager.execWithoutLogicDelete<SystemDict> {
            queryOne<SystemDict> {
                where(SystemDict::catalog eq catalog)
                and(SystemDict::code eq code)
            }
        }
        return record?.label ?: code
    }

    @Cacheable(CacheConstants.SYSTEM_DICT, key = "#catalog")
    fun getDictItems(catalog: String): List<SystemDict> = query<SystemDict> {
        where(SystemDict::catalog eq catalog)
        and(SystemDict::enabled eq true)
        orderBy(SystemDict::sort).asc()
    }

    fun getAllDictItems(catalog: String): List<SystemDict> = query<SystemDict> {
        where(SystemDict::catalog eq catalog)
        orderBy(SystemDict::sort).asc()
    }

    @CacheEvict(CacheConstants.SYSTEM_DICT, key = "#catalog")
    fun flushCache(catalog: String) = Unit

    @CacheEvict(CacheConstants.SYSTEM_DICT, key = "#catalog + ':' + #code")
    fun flushCache(catalog: String, code: String) = `this`.flushCache(catalog)

    companion object {
        private lateinit var `this`: DictUtils

        @JvmStatic
        @JvmName("GetDictCodeByLabel")
        fun getDictCodeByLabel(catalog: String, label: String): String = `this`.getDictCodeByLabel(catalog, label)

        @JvmStatic
        @JvmName("GetDictLabelByCode")
        fun getDictLabelByCode(catalog: String, code: String): String = `this`.getDictLabelByCode(catalog, code)
    }
}
