package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemMenu
import com.tzdig.framework.mybatis.mapper.system.SystemMenuMapper
import org.springframework.stereotype.Service

@Service
class ISystemMenu : IService<SystemMenu>, ServiceImpl<SystemMenuMapper, SystemMenu>()
