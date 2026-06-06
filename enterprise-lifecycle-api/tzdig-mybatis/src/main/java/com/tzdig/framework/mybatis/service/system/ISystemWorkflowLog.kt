package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowLog
import com.tzdig.framework.mybatis.mapper.system.SystemWorkflowLogMapper
import org.springframework.stereotype.Service

@Service
class ISystemWorkflowLog : IService<SystemWorkflowLog>,
    ServiceImpl<SystemWorkflowLogMapper, SystemWorkflowLog>()
