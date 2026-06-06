package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjBusinessTrip
import com.tzdig.framework.mybatis.mapper.zsxt.TProjBusinessTripMapper
import org.springframework.stereotype.Service

@Service
class ITProjBusinessTrip : IService<TProjBusinessTrip>,
    ServiceImpl<TProjBusinessTripMapper, TProjBusinessTrip>()
