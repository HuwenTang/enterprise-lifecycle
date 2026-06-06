package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.QuarterlyForecast2025
import com.tzdig.framework.mybatis.mapper.prime.QuarterlyForecast2025Mapper
import org.springframework.stereotype.Service

@Service
class IQuarterlyForecast2025 : IService<QuarterlyForecast2025>,
    ServiceImpl<QuarterlyForecast2025Mapper, QuarterlyForecast2025>()
