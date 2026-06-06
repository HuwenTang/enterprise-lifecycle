package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.QyxmCyflTjxx
import com.tzdig.framework.mybatis.entity.view.QyxmCyflTjxx111
import com.tzdig.framework.mybatis.mapper.view.QyxmCyflTjxx111Mapper
import com.tzdig.framework.mybatis.mapper.view.QyxmCyflTjxxMapper
import org.springframework.stereotype.Service

@Service
class IQyxmCyflTjxx : IService<QyxmCyflTjxx>, ServiceImpl<QyxmCyflTjxxMapper, QyxmCyflTjxx>()
