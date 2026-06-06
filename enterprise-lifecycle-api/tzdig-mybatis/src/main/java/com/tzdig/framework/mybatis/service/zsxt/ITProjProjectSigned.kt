package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjProjectSigned
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper
import org.springframework.stereotype.Service

@Service
class ITProjProjectSigned : IService<TProjProjectSigned>,
    ServiceImpl<TProjProjectSignedMapper, TProjProjectSigned>()
