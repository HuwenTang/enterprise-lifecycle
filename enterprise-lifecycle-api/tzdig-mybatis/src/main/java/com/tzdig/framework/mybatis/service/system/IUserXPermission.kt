package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.UserXPermission
import com.tzdig.framework.mybatis.mapper.system.UserXPermissionMapper
import org.springframework.stereotype.Service

@Service
class IUserXPermission : IService<UserXPermission>, ServiceImpl<UserXPermissionMapper, UserXPermission>()
