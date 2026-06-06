package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.UserXRole
import com.tzdig.framework.mybatis.mapper.system.UserXRoleMapper
import org.springframework.stereotype.Service

@Service
class IUserXRole : IService<UserXRole>,
    ServiceImpl<UserXRoleMapper, UserXRole>()
