package com.tzdig.framework.service.impl

import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.mybatis.entity.system.SystemArea
import com.tzdig.framework.security.util.DataGrantsUtils
import com.tzdig.framework.service.InvestOnlineService
import org.springframework.stereotype.Service

@Service
class InvestOnlineServiceImpl : InvestOnlineService {
    override fun getAreaCode(): List<String> =
        getAreaCode(grantedAreas = DataGrantsUtils.grantedAreas)

    override fun getAreaCode(grantedAreas: Collection<String>): List<String> {
        if (grantedAreas.isEmpty()) return emptyList()
        return query<SystemArea> {
            and(SystemArea::level eq 4)
            and(SystemArea::id inList grantedAreas)
        }.mapNotNull { it.zsDept }
    }

    override fun getAllAreaCode(grantedAreas: Collection<String>): List<String> {
        if (grantedAreas.isEmpty()) return emptyList()
        val parents = query<SystemArea> {
            and(SystemArea::level eq 4)
            and(SystemArea::id inList grantedAreas)
        }.mapNotNull { it.parentCode }
        return query<SystemArea> {
            and(SystemArea::level eq 4)
            and(SystemArea::parentCode inList parents)
        }.mapNotNull { it.zsDept }
    }

    override fun getCountyCode(): List<String> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) return emptyList()
        return query<SystemArea> {
            and(SystemArea::id inList grantedAreas)
            and(SystemArea::level eq 3)
        }.mapNotNull { it.id }
    }

    override fun getCountyName(): List<String> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) return emptyList()
        val parents = query<SystemArea> {
            and(SystemArea::level eq 4)
            and(SystemArea::id inList grantedAreas)
        }.mapNotNull { it.parentCode }
        if (grantedAreas.isEmpty()) return emptyList()
        return query<SystemArea> {
            and(SystemArea::id inList parents)
            and(SystemArea::level eq 3)
        }.mapNotNull { it.name }
    }

    override fun getAllAreaId(grantedAreas: Collection<String>): List<String> {
        if (grantedAreas.isEmpty()) return emptyList()
        return query<SystemArea> {
            and(SystemArea::level eq 4)
            and(SystemArea::id inList grantedAreas)
        }.mapNotNull { it.parentCode }
    }

    override fun getAllAreaName(): List<String> {
        val grantedAreas = DataGrantsUtils.grantedAreas
        if (grantedAreas.isEmpty()) return emptyList()
        return query<SystemArea> {
            and(SystemArea::id inList grantedAreas)
        }.mapNotNull { it.name }
    }
}
