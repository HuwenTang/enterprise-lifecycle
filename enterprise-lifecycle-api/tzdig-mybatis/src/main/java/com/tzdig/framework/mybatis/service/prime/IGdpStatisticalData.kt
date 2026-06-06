package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.GdpStatisticalData
import com.tzdig.framework.mybatis.mapper.prime.GdpStatisticalDataMapper
import org.springframework.stereotype.Service

@Service
class IGdpStatisticalData : IService<GdpStatisticalData>,
    ServiceImpl<GdpStatisticalDataMapper, GdpStatisticalData>()
