package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.FormSupportIndicator
import com.tzdig.framework.mybatis.mapper.prime.FormSupportIndicatorMapper
import org.springframework.stereotype.Service

@Service
class IFormSupportIndicator : IService<FormSupportIndicator>,
    ServiceImpl<FormSupportIndicatorMapper, FormSupportIndicator>()
