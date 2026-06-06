package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjectSignedOnline
import com.tzdig.framework.mybatis.mapper.zsxt.TProjectSignedOnlineMapper
import org.springframework.stereotype.Service

@Service
class ITProjectSignedOnline : IService<TProjectSignedOnline>,
    ServiceImpl<TProjectSignedOnlineMapper, TProjectSignedOnline>()
