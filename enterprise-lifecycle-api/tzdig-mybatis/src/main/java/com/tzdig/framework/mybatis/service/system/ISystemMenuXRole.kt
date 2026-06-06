package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemMenuXRole
import com.tzdig.framework.mybatis.mapper.system.SystemMenuXRoleMapper
import org.springframework.stereotype.Service

@Service
class ISystemMenuXRole : IService<SystemMenuXRole>, ServiceImpl<SystemMenuXRoleMapper, SystemMenuXRole>()
