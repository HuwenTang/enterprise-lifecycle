package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemLog
import com.tzdig.framework.mybatis.mapper.system.SystemLogMapper
import org.springframework.stereotype.Service

@Service
class ISystemLog : IService<SystemLog>,
    ServiceImpl<SystemLogMapper, SystemLog>()
