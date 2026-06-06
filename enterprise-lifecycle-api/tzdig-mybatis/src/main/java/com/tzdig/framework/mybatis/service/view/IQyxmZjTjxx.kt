package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.QyxmZjTjxx
import com.tzdig.framework.mybatis.mapper.view.QyxmZjTjxxMapper
import org.springframework.stereotype.Service

@Service
class IQyxmZjTjxx : IService<QyxmZjTjxx>, ServiceImpl<QyxmZjTjxxMapper, QyxmZjTjxx>()
