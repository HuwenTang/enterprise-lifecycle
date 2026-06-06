package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvestCheckLog
import com.tzdig.framework.mybatis.mapper.zsxt.TBizInvestCheckLogMapper
import org.springframework.stereotype.Service

@Service
class ITBizInvestCheckLog : IService<TBizInvestCheckLog>,
    ServiceImpl<TBizInvestCheckLogMapper, TBizInvestCheckLog>()
