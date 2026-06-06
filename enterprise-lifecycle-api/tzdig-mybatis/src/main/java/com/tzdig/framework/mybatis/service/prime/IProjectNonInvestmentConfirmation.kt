package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectNonInvestmentConfirmation
import com.tzdig.framework.mybatis.mapper.prime.ProjectNonInvestmentConfirmationMapper
import org.springframework.stereotype.Service

@Service
class IProjectNonInvestmentConfirmation : IService<ProjectNonInvestmentConfirmation>,
    ServiceImpl<ProjectNonInvestmentConfirmationMapper, ProjectNonInvestmentConfirmation>()
