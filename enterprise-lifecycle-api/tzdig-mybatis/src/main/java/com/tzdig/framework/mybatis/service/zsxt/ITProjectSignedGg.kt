package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjectSignedGg
import com.tzdig.framework.mybatis.mapper.zsxt.TProjectSignedGgMapper
import org.springframework.stereotype.Service

@Service
class ITProjectSignedGg : IService<TProjectSignedGg>,
    ServiceImpl<TProjectSignedGgMapper, TProjectSignedGg>()
