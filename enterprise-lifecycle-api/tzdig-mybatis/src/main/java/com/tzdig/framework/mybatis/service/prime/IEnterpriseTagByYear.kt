package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.EnterpriseTagByYear
import com.tzdig.framework.mybatis.mapper.prime.EnterpriseTagByYearMapper
import org.springframework.stereotype.Service

@Service
class IEnterpriseTagByYear : IService<EnterpriseTagByYear>,
    ServiceImpl<EnterpriseTagByYearMapper, EnterpriseTagByYear>()
