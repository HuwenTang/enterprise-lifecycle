package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionRelation
import com.tzdig.framework.mybatis.mapper.prime.ProjectConstructionRelationMapper
import org.springframework.stereotype.Service

@Service
class IProjectConstructionRelation : IService<ProjectConstructionRelation>,
    ServiceImpl<ProjectConstructionRelationMapper, ProjectConstructionRelation>()
