package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.XmJbxx
import com.tzdig.framework.mybatis.mapper.view.XmJbxxMapper
import org.springframework.stereotype.Service

@Service
class IXmJbxx : IService<XmJbxx>, ServiceImpl<XmJbxxMapper, XmJbxx>()
