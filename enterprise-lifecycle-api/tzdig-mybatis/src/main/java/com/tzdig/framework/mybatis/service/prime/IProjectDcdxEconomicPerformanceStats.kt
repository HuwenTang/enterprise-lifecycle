package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxEconomicPerformanceStats
import com.tzdig.framework.mybatis.mapper.prime.ProjectDcdxEconomicPerformanceStatsMapper
import org.springframework.stereotype.Service

@Service
class IProjectDcdxEconomicPerformanceStats : IService<ProjectDcdxEconomicPerformanceStats>,
    ServiceImpl<ProjectDcdxEconomicPerformanceStatsMapper, ProjectDcdxEconomicPerformanceStats>()
