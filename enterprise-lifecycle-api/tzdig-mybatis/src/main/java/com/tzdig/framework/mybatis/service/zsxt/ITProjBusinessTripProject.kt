package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjBusinessTripProject
import com.tzdig.framework.mybatis.mapper.zsxt.TProjBusinessTripProjectMapper
import org.springframework.stereotype.Service

@Service
class ITProjBusinessTripProject : IService<TProjBusinessTripProject>,
    ServiceImpl<TProjBusinessTripProjectMapper, TProjBusinessTripProject>()
