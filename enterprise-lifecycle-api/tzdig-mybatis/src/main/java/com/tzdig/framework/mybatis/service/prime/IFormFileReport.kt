package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.FormFileReport
import com.tzdig.framework.mybatis.mapper.prime.FormFileReportMapper
import org.springframework.stereotype.Service

@Service
class IFormFileReport : IService<FormFileReport>,
    ServiceImpl<FormFileReportMapper, FormFileReport>()
