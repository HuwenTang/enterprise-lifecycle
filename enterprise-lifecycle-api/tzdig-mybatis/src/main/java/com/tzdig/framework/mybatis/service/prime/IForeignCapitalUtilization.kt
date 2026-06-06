package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ForeignCapitalUtilization
import com.tzdig.framework.mybatis.mapper.prime.ForeignCapitalUtilizationMapper
import org.springframework.stereotype.Service

@Service
class IForeignCapitalUtilization : IService<ForeignCapitalUtilization>,
    ServiceImpl<ForeignCapitalUtilizationMapper, ForeignCapitalUtilization>()
