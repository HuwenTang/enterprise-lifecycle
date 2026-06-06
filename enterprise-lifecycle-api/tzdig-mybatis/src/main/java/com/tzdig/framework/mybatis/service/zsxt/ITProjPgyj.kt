package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjPgyj
import com.tzdig.framework.mybatis.mapper.zsxt.TProjPgyjMapper
import org.springframework.stereotype.Service

@Service
class ITProjPgyj : IService<TProjPgyj>,
    ServiceImpl<TProjPgyjMapper, TProjPgyj>()
