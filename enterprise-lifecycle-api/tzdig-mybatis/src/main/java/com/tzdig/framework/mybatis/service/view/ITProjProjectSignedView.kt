package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.TProjProjectSignedView
import com.tzdig.framework.mybatis.mapper.view.TProjProjectSignedViewMapper
import org.springframework.stereotype.Service

@Service
class ITProjProjectSignedView : IService<TProjProjectSignedView>,
    ServiceImpl<TProjProjectSignedViewMapper, TProjProjectSignedView>()
