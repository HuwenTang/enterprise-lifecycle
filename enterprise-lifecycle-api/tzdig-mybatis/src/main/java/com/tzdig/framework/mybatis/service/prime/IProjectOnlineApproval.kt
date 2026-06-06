package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApproval
import com.tzdig.framework.mybatis.mapper.prime.ProjectOnlineApprovalMapper
import org.springframework.stereotype.Service

@Service
class IProjectOnlineApproval : IService<ProjectOnlineApproval>,
    ServiceImpl<ProjectOnlineApprovalMapper, ProjectOnlineApproval>()
