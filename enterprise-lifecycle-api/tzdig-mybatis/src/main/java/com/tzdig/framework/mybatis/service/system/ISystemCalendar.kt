package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.SystemCalendar
import com.tzdig.framework.mybatis.mapper.system.SystemCalendarMapper
import org.springframework.stereotype.Service

@Service
class ISystemCalendar : IService<SystemCalendar>,
    ServiceImpl<SystemCalendarMapper, SystemCalendar>()
