package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestmentXConstructionApproval
import com.tzdig.framework.mybatis.mapper.prime.ProjectInvestmentXConstructionApprovalMapper
import org.springframework.stereotype.Service

@Service
class IProjectInvestmentXConstructionApproval : IService<ProjectInvestmentXConstructionApproval>,
    ServiceImpl<ProjectInvestmentXConstructionApprovalMapper, ProjectInvestmentXConstructionApproval>()
