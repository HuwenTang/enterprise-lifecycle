package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.KeySciTechProjects
import com.tzdig.framework.mybatis.mapper.prime.KeySciTechProjectsMapper
import org.springframework.stereotype.Service

@Service
class IKeySciTechProjects : IService<KeySciTechProjects>,
    ServiceImpl<KeySciTechProjectsMapper, KeySciTechProjects>()
