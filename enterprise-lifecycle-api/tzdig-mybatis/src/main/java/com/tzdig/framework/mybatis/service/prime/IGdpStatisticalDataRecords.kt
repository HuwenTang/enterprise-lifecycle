package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.GdpStatisticalDataRecords
import com.tzdig.framework.mybatis.mapper.prime.GdpStatisticalDataRecordsMapper
import org.springframework.stereotype.Service

@Service
class IGdpStatisticalDataRecords : IService<GdpStatisticalDataRecords>,
    ServiceImpl<GdpStatisticalDataRecordsMapper, GdpStatisticalDataRecords>()
