package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjTzTeam
import com.tzdig.framework.mybatis.mapper.zsxt.TProjTzTeamMapper
import org.springframework.stereotype.Service

@Service
class ITProjTzTeam : IService<TProjTzTeam>,
    ServiceImpl<TProjTzTeamMapper, TProjTzTeam>()
