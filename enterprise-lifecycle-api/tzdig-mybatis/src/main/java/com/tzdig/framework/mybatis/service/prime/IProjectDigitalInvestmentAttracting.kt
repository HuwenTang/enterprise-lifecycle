package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.mapper.prime.ProjectDigitalInvestmentAttractingMapper
import org.springframework.stereotype.Service

@Service
class IProjectDigitalInvestmentAttracting : IService<ProjectDigitalInvestmentAttracting>,
    ServiceImpl<ProjectDigitalInvestmentAttractingMapper, ProjectDigitalInvestmentAttracting>()
