package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionItemInfo
import com.tzdig.framework.mybatis.mapper.prime.ProjectConstructionItemInfoMapper
import org.springframework.stereotype.Service

@Service
class IProjectConstructionItemInfo : IService<ProjectConstructionItemInfo>,
    ServiceImpl<ProjectConstructionItemInfoMapper, ProjectConstructionItemInfo>()
