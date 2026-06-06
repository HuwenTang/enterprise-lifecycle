package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectCompletedInfo
import com.tzdig.framework.mybatis.mapper.prime.ProjectCompletedInfoMapper
import org.springframework.stereotype.Service

@Service
class IProjectCompletedInfo : IService<ProjectCompletedInfo>,
    ServiceImpl<ProjectCompletedInfoMapper, ProjectCompletedInfo>()
