package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.ZtxmTjxx
import com.tzdig.framework.mybatis.entity.view.ZtxmTjxx111
import com.tzdig.framework.mybatis.mapper.view.ZtxmTjxxMapper
import org.springframework.stereotype.Service

@Service
class IZtxmTjxx : IService<ZtxmTjxx>, ServiceImpl<ZtxmTjxxMapper, ZtxmTjxx>()
