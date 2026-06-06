package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.FormMonitorIndicatorField
import com.tzdig.framework.mybatis.mapper.prime.FormMonitorIndicatorFieldMapper
import org.springframework.stereotype.Service

@Service
class IFormMonitorIndicatorField : IService<FormMonitorIndicatorField>,
    ServiceImpl<FormMonitorIndicatorFieldMapper, FormMonitorIndicatorField>()
