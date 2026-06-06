package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvestFeedback
import com.tzdig.framework.mybatis.mapper.zsxt.TBizInvestFeedbackMapper
import org.springframework.stereotype.Service

@Service
class ITBizInvestFeedback : IService<TBizInvestFeedback>,
    ServiceImpl<TBizInvestFeedbackMapper, TBizInvestFeedback>()
