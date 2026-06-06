package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TLy
import com.tzdig.framework.mybatis.mapper.zsxt.TLyMapper
import org.springframework.stereotype.Service

@Service
class ITLy : IService<TLy>,
    ServiceImpl<TLyMapper, TLy>()
