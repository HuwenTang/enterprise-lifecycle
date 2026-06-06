package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TFile
import com.tzdig.framework.mybatis.mapper.zsxt.TFileMapper
import org.springframework.stereotype.Service

@Service
class ITFile : IService<TFile>,
    ServiceImpl<TFileMapper, TFile>()
