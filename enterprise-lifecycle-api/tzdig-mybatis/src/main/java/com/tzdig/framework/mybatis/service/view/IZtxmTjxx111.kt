package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.ZtxmTjxx111
import com.tzdig.framework.mybatis.mapper.view.ZtxmTjxx111Mapper
import com.tzdig.framework.mybatis.mapper.view.ZtxmTjxxMapper
import org.springframework.stereotype.Service

@Service
class IZtxmTjxx111 : IService<ZtxmTjxx111>, ServiceImpl<ZtxmTjxx111Mapper, ZtxmTjxx111>()
