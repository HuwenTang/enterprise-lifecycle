package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.TestEnum
import com.tzdig.framework.mybatis.mapper.system.TestEnumMapper
import org.springframework.stereotype.Service

@Service
class ITestEnum : IService<TestEnum>, ServiceImpl<TestEnumMapper, TestEnum>()
