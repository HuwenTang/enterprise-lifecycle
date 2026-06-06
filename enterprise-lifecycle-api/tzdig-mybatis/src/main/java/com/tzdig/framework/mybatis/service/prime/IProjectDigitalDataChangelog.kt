package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalDataChangelog
import com.tzdig.framework.mybatis.mapper.prime.ProjectDigitalDataChangelogMapper
import org.springframework.stereotype.Service

@Service
class IProjectDigitalDataChangelog : IService<ProjectDigitalDataChangelog>,
    ServiceImpl<ProjectDigitalDataChangelogMapper, ProjectDigitalDataChangelog>()
