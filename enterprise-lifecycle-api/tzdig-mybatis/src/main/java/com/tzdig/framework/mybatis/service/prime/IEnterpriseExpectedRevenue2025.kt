package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.EnterpriseExpectedRevenue2025
import com.tzdig.framework.mybatis.mapper.prime.EnterpriseExpectedRevenue2025Mapper
import org.springframework.stereotype.Service

@Service
class IEnterpriseExpectedRevenue2025 : IService<EnterpriseExpectedRevenue2025>,
    ServiceImpl<EnterpriseExpectedRevenue2025Mapper, EnterpriseExpectedRevenue2025>()
