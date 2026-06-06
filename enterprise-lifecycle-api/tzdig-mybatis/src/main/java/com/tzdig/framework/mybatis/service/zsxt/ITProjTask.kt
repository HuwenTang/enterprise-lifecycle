package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjTask
import com.tzdig.framework.mybatis.mapper.zsxt.TProjTaskMapper
import org.springframework.stereotype.Service

@Service
class ITProjTask : IService<TProjTask>,
    ServiceImpl<TProjTaskMapper, TProjTask>()
