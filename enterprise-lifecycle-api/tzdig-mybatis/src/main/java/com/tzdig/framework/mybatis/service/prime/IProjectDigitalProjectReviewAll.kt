package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import com.tzdig.framework.mybatis.mapper.prime.ProjectDigitalProjectReviewAllMapper
import org.springframework.stereotype.Service

@Service
class IProjectDigitalProjectReviewAll : IService<ProjectDigitalProjectReviewAll>,
    ServiceImpl<ProjectDigitalProjectReviewAllMapper, ProjectDigitalProjectReviewAll>()
