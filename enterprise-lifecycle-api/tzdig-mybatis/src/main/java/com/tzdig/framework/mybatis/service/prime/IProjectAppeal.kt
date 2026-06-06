package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectAppeal
import com.tzdig.framework.mybatis.mapper.prime.ProjectAppealMapper
import org.springframework.stereotype.Service

@Service
class IProjectAppeal : IService<ProjectAppeal>,
    ServiceImpl<ProjectAppealMapper, ProjectAppeal>()
