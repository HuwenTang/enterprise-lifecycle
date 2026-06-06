package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.EnterpriseIndustryCode
import com.tzdig.framework.mybatis.mapper.prime.EnterpriseIndustryCodeMapper
import org.springframework.stereotype.Service

@Service
class IEnterpriseIndustryCode : IService<EnterpriseIndustryCode>,
    ServiceImpl<EnterpriseIndustryCodeMapper, EnterpriseIndustryCode>()
