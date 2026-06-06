package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestPlan
import com.tzdig.framework.mybatis.mapper.prime.ProjectInvestPlanMapper
import org.springframework.stereotype.Service

@Service
class IProjectInvestPlan : IService<ProjectInvestPlan>,
    ServiceImpl<ProjectInvestPlanMapper, ProjectInvestPlan>()
