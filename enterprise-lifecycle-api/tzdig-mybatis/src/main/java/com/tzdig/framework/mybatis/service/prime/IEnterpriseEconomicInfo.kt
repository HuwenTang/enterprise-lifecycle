package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.EnterpriseEconomicInfo
import com.tzdig.framework.mybatis.mapper.prime.EnterpriseEconomicInfoMapper
import org.springframework.stereotype.Service

@Service
class IEnterpriseEconomicInfo : IService<EnterpriseEconomicInfo>,
    ServiceImpl<EnterpriseEconomicInfoMapper, EnterpriseEconomicInfo>()
