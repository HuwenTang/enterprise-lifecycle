package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectInfoFg
import com.tzdig.framework.mybatis.mapper.prime.ProjectInfoFgMapper
import org.springframework.stereotype.Service

@Service
class IProjectInfoFg : IService<ProjectInfoFg>,
    ServiceImpl<ProjectInfoFgMapper, ProjectInfoFg>()
