package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemScheduledJob
import com.tzdig.framework.mybatis.mapper.system.SystemScheduledJobMapper
import org.springframework.stereotype.Service

@Service
class ISystemScheduledJob : IService<SystemScheduledJob>,
    ServiceImpl<SystemScheduledJobMapper, SystemScheduledJob>()
