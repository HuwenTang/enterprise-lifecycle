package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjIndustry
import com.tzdig.framework.mybatis.mapper.zsxt.TProjIndustryMapper
import org.springframework.stereotype.Service

@Service
class ITProjIndustry : IService<TProjIndustry>,
    ServiceImpl<TProjIndustryMapper, TProjIndustry>()
