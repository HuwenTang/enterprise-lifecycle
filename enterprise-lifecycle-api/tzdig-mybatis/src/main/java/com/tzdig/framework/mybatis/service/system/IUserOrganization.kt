package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.UserOrganization
import com.tzdig.framework.mybatis.mapper.system.UserOrganizationMapper
import org.springframework.stereotype.Service

@Service
class IUserOrganization : IService<UserOrganization>, ServiceImpl<UserOrganizationMapper, UserOrganization>()
