package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ExtHlwJgOrg
import com.tzdig.framework.mybatis.mapper.prime.ExtHlwJgOrgMapper
import org.springframework.stereotype.Service

@Service
class IExtHlwJgOrg : IService<ExtHlwJgOrg>, ServiceImpl<ExtHlwJgOrgMapper, ExtHlwJgOrg>()
