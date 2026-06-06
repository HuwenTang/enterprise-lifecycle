package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjExchange
import com.tzdig.framework.mybatis.mapper.zsxt.TProjExchangeMapper
import org.springframework.stereotype.Service

@Service
class ITProjExchange : IService<TProjExchange>,
    ServiceImpl<TProjExchangeMapper, TProjExchange>()
