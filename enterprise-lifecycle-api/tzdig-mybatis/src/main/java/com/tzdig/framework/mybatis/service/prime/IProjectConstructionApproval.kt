package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApproval
import com.tzdig.framework.mybatis.mapper.prime.ProjectConstructionApprovalMapper
import org.springframework.stereotype.Service

@Service
class IProjectConstructionApproval : IService<ProjectConstructionApproval>,
    ServiceImpl<ProjectConstructionApprovalMapper, ProjectConstructionApproval>()
