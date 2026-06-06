package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectKeyProjectReview
import com.tzdig.framework.mybatis.mapper.prime.ProjectKeyProjectReviewMapper
import org.springframework.stereotype.Service

@Service
class IProjectKeyProjectReview : IService<ProjectKeyProjectReview>,
    ServiceImpl<ProjectKeyProjectReviewMapper, ProjectKeyProjectReview>()
