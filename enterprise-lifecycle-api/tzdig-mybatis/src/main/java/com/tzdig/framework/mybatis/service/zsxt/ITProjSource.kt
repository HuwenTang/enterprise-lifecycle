package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjSource
import com.tzdig.framework.mybatis.mapper.zsxt.TProjSourceMapper
import org.springframework.stereotype.Service

@Service
class ITProjSource : IService<TProjSource>,
    ServiceImpl<TProjSourceMapper, TProjSource>()
