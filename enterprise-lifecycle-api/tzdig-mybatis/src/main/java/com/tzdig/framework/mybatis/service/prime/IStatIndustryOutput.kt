package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.StatIndustryOutput
import com.tzdig.framework.mybatis.mapper.prime.StatIndustryOutputMapper
import org.springframework.stereotype.Service

@Service
class IStatIndustryOutput : IService<StatIndustryOutput>,
    ServiceImpl<StatIndustryOutputMapper, StatIndustryOutput>()
