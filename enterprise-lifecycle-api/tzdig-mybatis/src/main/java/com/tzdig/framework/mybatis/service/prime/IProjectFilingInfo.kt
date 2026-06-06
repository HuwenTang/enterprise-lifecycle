package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectFilingInfo
import com.tzdig.framework.mybatis.mapper.prime.ProjectFilingInfoMapper
import org.springframework.stereotype.Service

@Service
class IProjectFilingInfo : IService<ProjectFilingInfo>,
    ServiceImpl<ProjectFilingInfoMapper, ProjectFilingInfo>()
