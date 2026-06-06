package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemSmsLog
import com.tzdig.framework.mybatis.mapper.system.SystemSmsLogMapper
import org.springframework.stereotype.Service

@Service
class ISystemSmsLog : IService<SystemSmsLog>,
    ServiceImpl<SystemSmsLogMapper, SystemSmsLog>()
