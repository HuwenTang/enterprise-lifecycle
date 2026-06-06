package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.UserXOrganization
import com.tzdig.framework.mybatis.mapper.system.UserXOrganizationMapper
import org.springframework.stereotype.Service

@Service
class IUserXOrganization : IService<UserXOrganization>, ServiceImpl<UserXOrganizationMapper, UserXOrganization>()
