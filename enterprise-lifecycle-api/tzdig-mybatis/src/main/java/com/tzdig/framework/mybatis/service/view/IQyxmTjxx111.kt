package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.QyxmTjxx111
import com.tzdig.framework.mybatis.mapper.view.QyxmTjxx111Mapper
import com.tzdig.framework.mybatis.mapper.view.QyxmTjxxMapper
import org.springframework.stereotype.Service

@Service
class IQyxmTjxx111 : IService<QyxmTjxx111>, ServiceImpl<QyxmTjxx111Mapper, QyxmTjxx111>()
