package com.tzdig.framework.mybatis.service.system

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.system.OauthClientInfo
import com.tzdig.framework.mybatis.mapper.system.OauthClientInfoMapper
import org.springframework.stereotype.Service

@Service
class IOauthClientInfo : IService<OauthClientInfo>, ServiceImpl<OauthClientInfoMapper, OauthClientInfo>()
