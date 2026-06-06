package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.QyxmGmTjxx
import com.tzdig.framework.mybatis.mapper.view.QyxmGmTjxxMapper
import org.springframework.stereotype.Service

@Service
class IQyxmGmTjxx : IService<QyxmGmTjxx>, ServiceImpl<QyxmGmTjxxMapper, QyxmGmTjxx>()
