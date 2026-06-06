package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.DigitalTaizhou
import com.tzdig.framework.mybatis.mapper.prime.DigitalTaizhouMapper
import org.springframework.stereotype.Service

@Service
class IDigitalTaizhou : IService<DigitalTaizhou>,
    ServiceImpl<DigitalTaizhouMapper, DigitalTaizhou>()
