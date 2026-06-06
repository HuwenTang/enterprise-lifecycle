package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.EnterpriseInfo
import com.tzdig.framework.mybatis.mapper.prime.EnterpriseInfoMapper
import org.springframework.stereotype.Service

@Service
class IEnterpriseInfo : IService<EnterpriseInfo>,
    ServiceImpl<EnterpriseInfoMapper, EnterpriseInfo>()
