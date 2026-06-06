package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.UserVirtualOrg
import com.tzdig.framework.mybatis.mapper.prime.UserVirtualOrgMapper
import org.springframework.stereotype.Service

@Service
class IUserVirtualOrg : IService<UserVirtualOrg>,
    ServiceImpl<UserVirtualOrgMapper, UserVirtualOrg>()
