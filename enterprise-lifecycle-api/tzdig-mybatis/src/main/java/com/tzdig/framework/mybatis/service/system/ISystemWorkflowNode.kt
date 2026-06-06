package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemWorkflowNode
import com.tzdig.framework.mybatis.mapper.system.SystemWorkflowNodeMapper
import org.springframework.stereotype.Service

@Service
class ISystemWorkflowNode : IService<SystemWorkflowNode>,
    ServiceImpl<SystemWorkflowNodeMapper, SystemWorkflowNode>()
