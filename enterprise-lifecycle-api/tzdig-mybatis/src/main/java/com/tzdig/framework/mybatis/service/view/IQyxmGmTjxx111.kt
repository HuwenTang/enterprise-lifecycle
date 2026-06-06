package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.QyxmGmTjxx111
import com.tzdig.framework.mybatis.mapper.view.QyxmGmTjxx111Mapper
import com.tzdig.framework.mybatis.mapper.view.QyxmGmTjxxMapper
import org.springframework.stereotype.Service

@Service
class IQyxmGmTjxx111 : IService<QyxmGmTjxx111>, ServiceImpl<QyxmGmTjxx111Mapper, QyxmGmTjxx111>()
