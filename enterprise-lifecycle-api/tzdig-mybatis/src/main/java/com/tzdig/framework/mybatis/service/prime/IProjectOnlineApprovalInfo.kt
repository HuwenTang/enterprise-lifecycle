package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApprovalInfo
import com.tzdig.framework.mybatis.mapper.prime.ProjectOnlineApprovalInfoMapper
import org.springframework.stereotype.Service

@Service
class IProjectOnlineApprovalInfo : IService<ProjectOnlineApprovalInfo>,
    ServiceImpl<ProjectOnlineApprovalInfoMapper, ProjectOnlineApprovalInfo>()
