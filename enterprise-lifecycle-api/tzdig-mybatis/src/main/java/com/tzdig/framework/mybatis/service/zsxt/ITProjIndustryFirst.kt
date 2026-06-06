package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjIndustryFirst
import com.tzdig.framework.mybatis.mapper.zsxt.TProjIndustryFirstMapper
import org.springframework.stereotype.Service

@Service
class ITProjIndustryFirst : IService<TProjIndustryFirst>,
    ServiceImpl<TProjIndustryFirstMapper, TProjIndustryFirst>()
