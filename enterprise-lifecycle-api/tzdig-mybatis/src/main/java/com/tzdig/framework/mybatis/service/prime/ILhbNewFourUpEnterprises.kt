package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.LhbNewFourUpEnterprises
import com.tzdig.framework.mybatis.mapper.prime.LhbNewFourUpEnterprisesMapper
import org.springframework.stereotype.Service

@Service
class ILhbNewFourUpEnterprises : IService<LhbNewFourUpEnterprises>,
    ServiceImpl<LhbNewFourUpEnterprisesMapper, LhbNewFourUpEnterprises>()
