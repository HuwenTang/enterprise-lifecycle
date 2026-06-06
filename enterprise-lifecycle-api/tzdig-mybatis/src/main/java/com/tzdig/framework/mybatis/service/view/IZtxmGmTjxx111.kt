package com.tzdig.framework.mybatis.service.view

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.view.ZtxmGmTjxx111
import com.tzdig.framework.mybatis.mapper.view.ZtxmGmTjxx111Mapper
import com.tzdig.framework.mybatis.mapper.view.ZtxmGmTjxxMapper
import org.springframework.stereotype.Service

@Service
class IZtxmGmTjxx111 : IService<ZtxmGmTjxx111>, ServiceImpl<ZtxmGmTjxx111Mapper, ZtxmGmTjxx111>()
