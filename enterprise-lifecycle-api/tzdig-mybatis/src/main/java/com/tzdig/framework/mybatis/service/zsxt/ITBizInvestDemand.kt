package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvestDemand
import com.tzdig.framework.mybatis.mapper.zsxt.TBizInvestDemandMapper
import org.springframework.stereotype.Service

@Service
class ITBizInvestDemand : IService<TBizInvestDemand>,
    ServiceImpl<TBizInvestDemandMapper, TBizInvestDemand>()
