package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TLyDesc
import com.tzdig.framework.mybatis.mapper.zsxt.TLyDescMapper
import org.springframework.stereotype.Service

@Service
class ITLyDesc : IService<TLyDesc>,
    ServiceImpl<TLyDescMapper, TLyDesc>()
