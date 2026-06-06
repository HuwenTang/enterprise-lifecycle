package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectImportantProvinceInfo
import com.tzdig.framework.mybatis.mapper.prime.ProjectImportantProvinceInfoMapper
import org.springframework.stereotype.Service

@Service
class IProjectImportantProvinceInfo : IService<ProjectImportantProvinceInfo>,
    ServiceImpl<ProjectImportantProvinceInfoMapper, ProjectImportantProvinceInfo>()
