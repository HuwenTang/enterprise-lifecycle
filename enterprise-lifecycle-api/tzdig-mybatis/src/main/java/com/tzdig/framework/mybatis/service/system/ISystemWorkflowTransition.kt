package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowTransition
import com.tzdig.framework.mybatis.mapper.system.SystemWorkflowTransitionMapper
import org.springframework.stereotype.Service

@Service
class ISystemWorkflowTransition : IService<SystemWorkflowTransition>,
    ServiceImpl<SystemWorkflowTransitionMapper, SystemWorkflowTransition>()
