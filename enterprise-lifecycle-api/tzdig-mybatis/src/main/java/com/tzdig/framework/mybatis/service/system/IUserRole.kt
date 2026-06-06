package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.UserRole
import com.tzdig.framework.mybatis.mapper.system.UserRoleMapper
import org.springframework.stereotype.Service

@Service
class IUserRole : IService<UserRole>, ServiceImpl<UserRoleMapper, UserRole>()
