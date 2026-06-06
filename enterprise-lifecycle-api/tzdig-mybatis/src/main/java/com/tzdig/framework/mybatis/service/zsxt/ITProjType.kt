package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjType
import com.tzdig.framework.mybatis.mapper.zsxt.TProjTypeMapper
import org.springframework.stereotype.Service

@Service
class ITProjType : IService<TProjType>,
    ServiceImpl<TProjTypeMapper, TProjType>()
