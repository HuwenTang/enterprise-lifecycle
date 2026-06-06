package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.StatProjectItemCostTime
import com.tzdig.framework.mybatis.mapper.prime.StatProjectItemCostTimeMapper
import org.springframework.stereotype.Service

@Service
class IStatProjectItemCostTime : IService<StatProjectItemCostTime>,
    ServiceImpl<StatProjectItemCostTimeMapper, StatProjectItemCostTime>()
