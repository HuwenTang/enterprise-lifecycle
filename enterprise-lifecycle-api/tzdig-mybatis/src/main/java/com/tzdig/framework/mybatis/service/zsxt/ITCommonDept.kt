package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TCommonDept
import com.tzdig.framework.mybatis.mapper.zsxt.TCommonDeptMapper
import org.springframework.stereotype.Service

@Service
class ITCommonDept : IService<TCommonDept>,
    ServiceImpl<TCommonDeptMapper, TCommonDept>()
