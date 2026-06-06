package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiKeyProjects
import com.tzdig.framework.mybatis.mapper.prime.ProjectFagaiKeyProjectsMapper
import org.springframework.stereotype.Service

@Service
class IProjectFagaiKeyProjects : IService<ProjectFagaiKeyProjects>,
    ServiceImpl<ProjectFagaiKeyProjectsMapper, ProjectFagaiKeyProjects>()
