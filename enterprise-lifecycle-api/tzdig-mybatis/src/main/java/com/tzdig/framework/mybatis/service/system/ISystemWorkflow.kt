package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemWorkflow
import com.tzdig.framework.mybatis.mapper.system.SystemWorkflowMapper
import org.springframework.stereotype.Service

@Service
class ISystemWorkflow : IService<SystemWorkflow>,
    ServiceImpl<SystemWorkflowMapper, SystemWorkflow>()
