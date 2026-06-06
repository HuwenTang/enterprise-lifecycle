package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectOnlineApprovalInfoDetail
import com.tzdig.framework.mybatis.mapper.prime.ProjectOnlineApprovalInfoDetailMapper
import org.springframework.stereotype.Service

@Service
class IProjectOnlineApprovalInfoDetail : IService<ProjectOnlineApprovalInfoDetail>,
    ServiceImpl<ProjectOnlineApprovalInfoDetailMapper, ProjectOnlineApprovalInfoDetail>()
