package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ExtZsProjProjectSigned
import com.tzdig.framework.mybatis.mapper.prime.ExtZsProjProjectSignedMapper
import org.springframework.stereotype.Service

@Service
class IExtZsProjProjectSigned : IService<ExtZsProjProjectSigned>,
    ServiceImpl<ExtZsProjProjectSignedMapper, ExtZsProjProjectSigned>()
