package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.LhbMajorProjectStatus
import com.tzdig.framework.mybatis.mapper.prime.LhbMajorProjectStatusMapper
import org.springframework.stereotype.Service

@Service
class ILhbMajorProjectStatus : IService<LhbMajorProjectStatus>,
    ServiceImpl<LhbMajorProjectStatusMapper, LhbMajorProjectStatus>()
