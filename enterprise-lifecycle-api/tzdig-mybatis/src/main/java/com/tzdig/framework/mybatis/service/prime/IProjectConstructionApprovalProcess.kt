package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApprovalProcess
import com.tzdig.framework.mybatis.mapper.prime.ProjectConstructionApprovalProcessMapper
import org.springframework.stereotype.Service

@Service
class IProjectConstructionApprovalProcess : IService<ProjectConstructionApprovalProcess>,
    ServiceImpl<ProjectConstructionApprovalProcessMapper, ProjectConstructionApprovalProcess>()
