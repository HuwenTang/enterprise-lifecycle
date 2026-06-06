package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.UserPermission
import com.tzdig.framework.mybatis.mapper.system.UserPermissionMapper
import org.springframework.stereotype.Service

@Service
class IUserPermission : IService<UserPermission>, ServiceImpl<UserPermissionMapper, UserPermission>()
