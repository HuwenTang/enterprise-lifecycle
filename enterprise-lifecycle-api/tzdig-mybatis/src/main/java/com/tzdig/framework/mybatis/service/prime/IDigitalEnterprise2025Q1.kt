package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.DigitalEnterprise2025Q1
import com.tzdig.framework.mybatis.mapper.prime.DigitalEnterprise2025Q1Mapper
import org.springframework.stereotype.Service

@Service
class IDigitalEnterprise2025Q1 : IService<DigitalEnterprise2025Q1>,
    ServiceImpl<DigitalEnterprise2025Q1Mapper, DigitalEnterprise2025Q1>()
