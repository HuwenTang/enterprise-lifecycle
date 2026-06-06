package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.QyxmTjxx
import com.tzdig.framework.mybatis.entity.view.QyxmTjxx111
import com.tzdig.framework.mybatis.mapper.view.QyxmTjxxMapper
import org.springframework.stereotype.Service

@Service
class IQyxmTjxx : IService<QyxmTjxx>, ServiceImpl<QyxmTjxxMapper, QyxmTjxx>()
