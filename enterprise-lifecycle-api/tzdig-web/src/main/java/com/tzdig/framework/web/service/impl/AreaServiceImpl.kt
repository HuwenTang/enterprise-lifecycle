package com.tzdig.framework.web.service.impl

import com.mybatisflex.core.logicdelete.LogicDeleteManager
import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.db.queryOneById
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.core.constant.CacheConstants
import com.tzdig.framework.mybatis.entity.system.SystemArea
import com.tzdig.framework.web.service.AreaService
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service

@Service
class AreaServiceImpl : AreaService {
    @Cacheable(CacheConstants.SYSTEM_AREA, key = "#id")
    override fun getById(id: String): SystemArea? =
        LogicDeleteManager.execWithoutLogicDelete<SystemArea> { queryOneById(id) }

    override fun getAllChildren(areas: Collection<SystemArea>): Set<SystemArea> {
        if (areas.isEmpty()) return emptySet()
        val set = areas.toMutableSet()
        var next = areas
        while (next.isNotEmpty()) {
            next = filter<SystemArea> { SystemArea::parentCode inList next.map { it.id!! } }
            set.addAll(next)
        }
        return set
    }
}
