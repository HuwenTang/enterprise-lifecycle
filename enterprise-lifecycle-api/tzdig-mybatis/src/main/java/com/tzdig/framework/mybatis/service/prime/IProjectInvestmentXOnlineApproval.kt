package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestmentXOnlineApproval
import com.tzdig.framework.mybatis.mapper.prime.ProjectInvestmentXOnlineApprovalMapper
import org.springframework.stereotype.Service

@Service
class IProjectInvestmentXOnlineApproval : IService<ProjectInvestmentXOnlineApproval>,
    ServiceImpl<ProjectInvestmentXOnlineApprovalMapper, ProjectInvestmentXOnlineApproval>()
