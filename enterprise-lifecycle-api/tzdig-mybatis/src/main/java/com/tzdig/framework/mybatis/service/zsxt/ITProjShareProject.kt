package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjShareProject
import com.tzdig.framework.mybatis.mapper.zsxt.TProjShareProjectMapper
import org.springframework.stereotype.Service

@Service
class ITProjShareProject : IService<TProjShareProject>,
    ServiceImpl<TProjShareProjectMapper, TProjShareProject>()
