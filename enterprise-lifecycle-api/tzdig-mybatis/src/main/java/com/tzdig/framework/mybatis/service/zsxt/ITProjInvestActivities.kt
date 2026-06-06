package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjInvestActivities
import com.tzdig.framework.mybatis.mapper.zsxt.TProjInvestActivitiesMapper
import org.springframework.stereotype.Service

@Service
class ITProjInvestActivities : IService<TProjInvestActivities>,
    ServiceImpl<TProjInvestActivitiesMapper, TProjInvestActivities>()
