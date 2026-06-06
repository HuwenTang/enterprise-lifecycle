package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.QyxmJzTjxx111
import com.tzdig.framework.mybatis.mapper.view.QyxmJzTjxx111Mapper
import com.tzdig.framework.mybatis.mapper.view.QyxmJzTjxxMapper
import org.springframework.stereotype.Service

@Service
class IQyxmJzTjxx111 : IService<QyxmJzTjxx111>, ServiceImpl<QyxmJzTjxx111Mapper, QyxmJzTjxx111>()
