package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TCommonManager
import com.tzdig.framework.mybatis.mapper.zsxt.TCommonManagerMapper
import org.springframework.stereotype.Service

@Service
class ITCommonManager : IService<TCommonManager>,
    ServiceImpl<TCommonManagerMapper, TCommonManager>()
