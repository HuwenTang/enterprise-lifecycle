package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.ZtxmZjTjxx
import com.tzdig.framework.mybatis.mapper.view.ZtxmZjTjxxMapper
import org.springframework.stereotype.Service

@Service
class IZtxmZjTjxx : IService<ZtxmZjTjxx>, ServiceImpl<ZtxmZjTjxxMapper, ZtxmZjTjxx>()
