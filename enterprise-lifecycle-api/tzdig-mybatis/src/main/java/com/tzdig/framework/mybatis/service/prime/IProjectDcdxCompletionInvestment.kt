package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectDcdxCompletionInvestment
import com.tzdig.framework.mybatis.mapper.prime.ProjectDcdxCompletionInvestmentMapper
import org.springframework.stereotype.Service

@Service
class IProjectDcdxCompletionInvestment : IService<ProjectDcdxCompletionInvestment>,
    ServiceImpl<ProjectDcdxCompletionInvestmentMapper, ProjectDcdxCompletionInvestment>()
