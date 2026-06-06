package com.tzdig.framework.service.impl

import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.db.queryCount
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.mybatis.entity.prime.EnterpriseInfo
import com.tzdig.framework.mybatis.entity.prime.EnterpriseTagByYear
import com.tzdig.framework.service.EnterpriseTagService
import org.springframework.stereotype.Service

@Service
class EnterpriseTagServiceImpl : EnterpriseTagService {
    override fun getUsccListByTags(
        year: Int,
        quarter: Int,
        vararg tags: String,
    ): Set<String> {
        val sets = tags.map { tag ->
            val list = query<EnterpriseTagByYear> {
                where(EnterpriseTagByYear::tag eq tag)
                and(EnterpriseTagByYear::year eq year)
                and(EnterpriseTagByYear::quarter eq quarter)
            }
            list.map { it.uscc!! }.toSet()
        }
        return sets.reduce { acc, set -> acc.intersect(set) }
    }

    override fun getUsccListByTagsAndDistrict(
        year: Int,
        quarter: Int,
        district: Collection<String>,
        vararg tags: String,
    ): Set<String> {
        val set = getUsccListByTags(year, quarter, *tags)
        if (set.isEmpty()) return emptySet()
        if (district.isEmpty()) return set
        val list = query<EnterpriseInfo> {
            where(EnterpriseInfo::id inList set)
            and(EnterpriseInfo::district inList district)
        }
        return list.map { it.id!! }.toSet()
    }

    override fun countTopAndDigitalEconomic(tag: String, year: Int, quarter: Int) =
        getUsccListByTags(year, quarter, tag, "digital_economic").size

    override fun countTopAndDigitalEconomicByDistrict(
        tag: String,
        year: Int,
        quarter: Int,
        district: Collection<String>
    ): Int {
        val set = getUsccListByTags(year, quarter, tag, "digital_economic")
        if (set.isEmpty()) return 0
        if (district.isEmpty()) return set.size
        return queryCount<EnterpriseInfo> {
            where(EnterpriseInfo::id inList set)
            and(EnterpriseInfo::district inList district)
        }.toInt()
    }
}
