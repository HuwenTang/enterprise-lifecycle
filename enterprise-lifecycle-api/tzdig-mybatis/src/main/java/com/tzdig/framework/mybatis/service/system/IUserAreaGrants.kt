package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.UserAreaGrants
import com.tzdig.framework.mybatis.mapper.system.UserAreaGrantsMapper
import org.springframework.stereotype.Service

@Service
class IUserAreaGrants : IService<UserAreaGrants>,
    ServiceImpl<UserAreaGrantsMapper, UserAreaGrants>()
