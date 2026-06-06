package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.DsProject
import com.tzdig.framework.mybatis.mapper.prime.DsProjectMapper
import org.springframework.stereotype.Service

@Service
class IDsProject : IService<DsProject>,
    ServiceImpl<DsProjectMapper, DsProject>()
