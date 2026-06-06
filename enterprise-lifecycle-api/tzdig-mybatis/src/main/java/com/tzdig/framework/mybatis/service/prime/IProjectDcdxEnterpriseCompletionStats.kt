package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEnterpriseCompletionStats
import com.tzdig.framework.mybatis.mapper.prime.ProjectDcdxEnterpriseCompletionStatsMapper
import org.springframework.stereotype.Service

@Service
class IProjectDcdxEnterpriseCompletionStats : IService<ProjectDcdxEnterpriseCompletionStats>,
    ServiceImpl<ProjectDcdxEnterpriseCompletionStatsMapper, ProjectDcdxEnterpriseCompletionStats>()
