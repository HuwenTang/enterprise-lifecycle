package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.SysDept
import com.tzdig.framework.mybatis.mapper.view.SysDeptMapper
import org.springframework.stereotype.Service

@Service
class ISysDept : IService<SysDept>,
    ServiceImpl<SysDeptMapper, SysDept>()
