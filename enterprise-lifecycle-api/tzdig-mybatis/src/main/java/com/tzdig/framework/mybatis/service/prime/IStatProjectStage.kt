package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.StatProjectStage
import com.tzdig.framework.mybatis.mapper.prime.StatProjectStageMapper
import org.springframework.stereotype.Service

@Service
class IStatProjectStage : IService<StatProjectStage>,
    ServiceImpl<StatProjectStageMapper, StatProjectStage>()
