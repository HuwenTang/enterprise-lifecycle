package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.EnterpriseInnovativeClusters
import com.tzdig.framework.mybatis.mapper.prime.EnterpriseInnovativeClustersMapper
import org.springframework.stereotype.Service

@Service
class IEnterpriseInnovativeClusters : IService<EnterpriseInnovativeClusters>,
    ServiceImpl<EnterpriseInnovativeClustersMapper, EnterpriseInnovativeClusters>()
