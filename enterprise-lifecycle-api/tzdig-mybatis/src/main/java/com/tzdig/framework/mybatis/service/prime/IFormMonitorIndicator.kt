package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.FormMonitorIndicator
import com.tzdig.framework.mybatis.mapper.prime.FormMonitorIndicatorMapper
import org.springframework.stereotype.Service

@Service
class IFormMonitorIndicator : IService<FormMonitorIndicator>,
    ServiceImpl<FormMonitorIndicatorMapper, FormMonitorIndicator>()
