package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemDict
import com.tzdig.framework.mybatis.mapper.system.SystemDictMapper
import org.springframework.stereotype.Service

@Service
class ISystemDict : IService<SystemDict>, ServiceImpl<SystemDictMapper, SystemDict>()
