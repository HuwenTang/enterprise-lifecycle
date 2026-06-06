package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.IndustryChain
import com.tzdig.framework.mybatis.mapper.prime.IndustryChainMapper
import org.springframework.stereotype.Service

@Service
class IIndustryChain : IService<IndustryChain>,
    ServiceImpl<IndustryChainMapper, IndustryChain>()
