package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEnterpriseCompletion
import com.tzdig.framework.mybatis.mapper.prime.ProjectDcdxEnterpriseCompletionMapper
import org.springframework.stereotype.Service

@Service
class IProjectDcdxEnterpriseCompletion : IService<ProjectDcdxEnterpriseCompletion>,
    ServiceImpl<ProjectDcdxEnterpriseCompletionMapper, ProjectDcdxEnterpriseCompletion>()
