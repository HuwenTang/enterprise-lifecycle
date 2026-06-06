package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.QyxmYdqsTjxx
import com.tzdig.framework.mybatis.mapper.view.QyxmYdqsTjxxMapper
import org.springframework.stereotype.Service

@Service
class IQyxmYdqsTjxx : IService<QyxmYdqsTjxx>, ServiceImpl<QyxmYdqsTjxxMapper, QyxmYdqsTjxx>()
