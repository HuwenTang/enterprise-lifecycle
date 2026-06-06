package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TCommonRole
import com.tzdig.framework.mybatis.mapper.zsxt.TCommonRoleMapper
import org.springframework.stereotype.Service

@Service
class ITCommonRole : IService<TCommonRole>,
    ServiceImpl<TCommonRoleMapper, TCommonRole>()
