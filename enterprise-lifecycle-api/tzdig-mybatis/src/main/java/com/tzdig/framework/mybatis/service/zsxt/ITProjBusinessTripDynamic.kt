package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjBusinessTripDynamic
import com.tzdig.framework.mybatis.mapper.zsxt.TProjBusinessTripDynamicMapper
import org.springframework.stereotype.Service

@Service
class ITProjBusinessTripDynamic : IService<TProjBusinessTripDynamic>,
    ServiceImpl<TProjBusinessTripDynamicMapper, TProjBusinessTripDynamic>()
