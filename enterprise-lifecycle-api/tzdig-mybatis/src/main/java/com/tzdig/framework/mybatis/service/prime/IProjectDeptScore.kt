package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectDeptScore
import com.tzdig.framework.mybatis.mapper.prime.ProjectDeptScoreMapper
import org.springframework.stereotype.Service

@Service
class IProjectDeptScore : IService<ProjectDeptScore>,
    ServiceImpl<ProjectDeptScoreMapper, ProjectDeptScore>()
