package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiKeyProjectsStats
import com.tzdig.framework.mybatis.mapper.prime.ProjectFagaiKeyProjectsStatsMapper
import org.springframework.stereotype.Service

@Service
class IProjectFagaiKeyProjectsStats : IService<ProjectFagaiKeyProjectsStats>,
    ServiceImpl<ProjectFagaiKeyProjectsStatsMapper, ProjectFagaiKeyProjectsStats>()
