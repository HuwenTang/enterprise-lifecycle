package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProject
import com.tzdig.framework.mybatis.mapper.prime.ProjectKeyProjectMapper
import org.springframework.stereotype.Service

@Service
class IProjectKeyProject : IService<ProjectKeyProject>,
    ServiceImpl<ProjectKeyProjectMapper, ProjectKeyProject>()
