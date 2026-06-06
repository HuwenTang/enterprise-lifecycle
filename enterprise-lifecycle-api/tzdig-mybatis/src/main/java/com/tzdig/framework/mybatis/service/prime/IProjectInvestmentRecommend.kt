package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestmentRecommend
import com.tzdig.framework.mybatis.mapper.prime.ProjectInvestmentRecommendMapper
import org.springframework.stereotype.Service

@Service
class IProjectInvestmentRecommend : IService<ProjectInvestmentRecommend>,
    ServiceImpl<ProjectInvestmentRecommendMapper, ProjectInvestmentRecommend>()
