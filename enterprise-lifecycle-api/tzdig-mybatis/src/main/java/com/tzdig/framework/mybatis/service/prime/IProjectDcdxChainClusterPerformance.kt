package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxChainClusterPerformance
import com.tzdig.framework.mybatis.mapper.prime.ProjectDcdxChainClusterPerformanceMapper
import org.springframework.stereotype.Service

@Service
class IProjectDcdxChainClusterPerformance : IService<ProjectDcdxChainClusterPerformance>,
    ServiceImpl<ProjectDcdxChainClusterPerformanceMapper, ProjectDcdxChainClusterPerformance>()
