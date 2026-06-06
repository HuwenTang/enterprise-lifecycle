package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TCommonManagerRole
import com.tzdig.framework.mybatis.mapper.zsxt.TCommonManagerRoleMapper
import org.springframework.stereotype.Service

@Service
class ITCommonManagerRole : IService<TCommonManagerRole>,
    ServiceImpl<TCommonManagerRoleMapper, TCommonManagerRole>()
