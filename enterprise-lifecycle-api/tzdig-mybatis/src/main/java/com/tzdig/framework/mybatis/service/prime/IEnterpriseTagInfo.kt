package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.EnterpriseTagInfo
import com.tzdig.framework.mybatis.mapper.prime.EnterpriseTagInfoMapper
import org.springframework.stereotype.Service

@Service
class IEnterpriseTagInfo : IService<EnterpriseTagInfo>,
    ServiceImpl<EnterpriseTagInfoMapper, EnterpriseTagInfo>()
