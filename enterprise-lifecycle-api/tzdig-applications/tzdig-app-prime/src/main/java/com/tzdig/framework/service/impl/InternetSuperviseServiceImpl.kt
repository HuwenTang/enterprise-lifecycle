package com.tzdig.framework.service.impl

import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.isNotNull
import com.tzdig.framework.core.constant.CacheConstants
import com.tzdig.framework.model.vo.UserInfoVO
import com.tzdig.framework.mybatis.entity.prime.FGTH
import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.mybatis.entity.system.UserOrganization
import com.tzdig.framework.mybatis.entity.system.UserXOrganization
import com.tzdig.framework.mybatis.mapper.prime.FGTHMapper
import com.tzdig.framework.service.InternetSuperviseService
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service

@Service
class InternetSuperviseServiceImpl(
    private val fgth: FGTHMapper
) : InternetSuperviseService {
    override fun getUserInfo(user: UserAccount): UserInfoVO {
        var cobId = ""
        val userOrganizationId = filterOne<UserXOrganization> { UserXOrganization::userid eq user.id }?.organizationId
        if (userOrganizationId != null) {
            cobId = filterOne<UserOrganization> { UserOrganization::id eq userOrganizationId }?.cob ?: ""
        }
        return UserInfoVO(
            id = user.mobile!!,
            name = user.realName!!,
            cobId = cobId,
        )
    }

    @Cacheable(CacheConstants.STATISTIC_HOME)
    override fun getStatistic(): Long {
        val fgth = fgth.selectOneByCondition(FGTH::fgthzts.isNotNull).fgthzts
        return fgth?.toLong() ?: 0
    }
}
