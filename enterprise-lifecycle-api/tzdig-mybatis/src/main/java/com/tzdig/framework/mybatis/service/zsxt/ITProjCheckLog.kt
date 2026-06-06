package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjCheckLog
import com.tzdig.framework.mybatis.mapper.zsxt.TProjCheckLogMapper
import org.springframework.stereotype.Service

@Service
class ITProjCheckLog : IService<TProjCheckLog>,
    ServiceImpl<TProjCheckLogMapper, TProjCheckLog>()
