package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjProject
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectMapper
import org.springframework.stereotype.Service

@Service
class ITProjProject : IService<TProjProject>,
    ServiceImpl<TProjProjectMapper, TProjProject>()
