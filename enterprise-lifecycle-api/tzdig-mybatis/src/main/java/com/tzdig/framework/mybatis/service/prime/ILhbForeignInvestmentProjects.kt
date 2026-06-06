package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.LhbForeignInvestmentProjects
import com.tzdig.framework.mybatis.mapper.prime.LhbForeignInvestmentProjectsMapper
import org.springframework.stereotype.Service

@Service
class ILhbForeignInvestmentProjects : IService<LhbForeignInvestmentProjects>,
    ServiceImpl<LhbForeignInvestmentProjectsMapper, LhbForeignInvestmentProjects>()
