package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TBizZone
import com.tzdig.framework.mybatis.mapper.zsxt.TBizZoneMapper
import org.springframework.stereotype.Service

@Service
class ITBizZone : IService<TBizZone>,
    ServiceImpl<TBizZoneMapper, TBizZone>()
