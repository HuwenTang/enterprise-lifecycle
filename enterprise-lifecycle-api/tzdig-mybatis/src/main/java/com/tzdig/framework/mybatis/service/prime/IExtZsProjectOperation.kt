package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjectOperation
import com.tzdig.framework.mybatis.mapper.prime.ExtZsProjectOperationMapper
import org.springframework.stereotype.Service

@Service
class IExtZsProjectOperation : IService<ExtZsProjectOperation>,
    ServiceImpl<ExtZsProjectOperationMapper, ExtZsProjectOperation>()
