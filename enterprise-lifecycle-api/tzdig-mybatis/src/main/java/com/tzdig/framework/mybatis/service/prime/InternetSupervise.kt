package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.InternetSupervise
import com.tzdig.framework.mybatis.mapper.prime.InternetSuperviseMapper
import org.springframework.stereotype.Service

@Service
class InternetSupervise : IService<InternetSupervise>, ServiceImpl<InternetSuperviseMapper, InternetSupervise>()
