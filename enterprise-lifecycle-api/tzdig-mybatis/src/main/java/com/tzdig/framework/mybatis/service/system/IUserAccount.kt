package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.UserAccount
import com.tzdig.framework.mybatis.mapper.system.UserAccountMapper
import org.springframework.stereotype.Service

@Service
class IUserAccount : IService<UserAccount>, ServiceImpl<UserAccountMapper, UserAccount>()
