package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemDictCatalog
import com.tzdig.framework.mybatis.mapper.system.SystemDictCatalogMapper
import org.springframework.stereotype.Service

@Service
class ISystemDictCatalog : IService<SystemDictCatalog>, ServiceImpl<SystemDictCatalogMapper, SystemDictCatalog>()
