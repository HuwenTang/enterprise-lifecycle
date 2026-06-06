package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.InternetSuperviseCheck
import com.tzdig.framework.mybatis.mapper.prime.InternetSuperviseCheckMapper
import org.springframework.stereotype.Service

@Service
class InternetSuperviseCheck : IService<InternetSuperviseCheck>, ServiceImpl<InternetSuperviseCheckMapper, InternetSuperviseCheck>()
