package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.DigitalEconomicTaxLevel
import com.tzdig.framework.mybatis.mapper.prime.DigitalEconomicTaxLevelMapper
import org.springframework.stereotype.Service

@Service
class IDigitalEconomicTaxLevel : IService<DigitalEconomicTaxLevel>,
    ServiceImpl<DigitalEconomicTaxLevelMapper, DigitalEconomicTaxLevel>()
