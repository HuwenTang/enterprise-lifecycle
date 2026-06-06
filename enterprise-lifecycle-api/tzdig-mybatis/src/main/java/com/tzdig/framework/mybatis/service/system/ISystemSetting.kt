package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemSetting
import com.tzdig.framework.mybatis.mapper.system.SystemSettingMapper
import org.springframework.stereotype.Service

@Service
class ISystemSetting : IService<SystemSetting>, ServiceImpl<SystemSettingMapper, SystemSetting>()
