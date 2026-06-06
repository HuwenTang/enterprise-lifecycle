package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalService
import com.tzdig.framework.mybatis.mapper.prime.ProjectDigitalServiceMapper
import org.springframework.stereotype.Service

@Service
class IProjectDigitalService : IService<ProjectDigitalService>,
    ServiceImpl<ProjectDigitalServiceMapper, ProjectDigitalService>()
