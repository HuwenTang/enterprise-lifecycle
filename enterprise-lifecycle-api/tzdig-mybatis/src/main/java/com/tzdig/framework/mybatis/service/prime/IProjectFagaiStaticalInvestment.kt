package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiStaticalInvestment
import com.tzdig.framework.mybatis.mapper.prime.ProjectFagaiStaticalInvestmentMapper
import org.springframework.stereotype.Service

@Service
class IProjectFagaiStaticalInvestment : IService<ProjectFagaiStaticalInvestment>,
    ServiceImpl<ProjectFagaiStaticalInvestmentMapper, ProjectFagaiStaticalInvestment>()
