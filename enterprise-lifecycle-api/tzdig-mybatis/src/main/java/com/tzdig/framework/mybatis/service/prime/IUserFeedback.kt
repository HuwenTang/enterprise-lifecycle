package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.UserFeedback
import com.tzdig.framework.mybatis.mapper.prime.UserFeedbackMapper
import org.springframework.stereotype.Service

@Service
class IUserFeedback : IService<UserFeedback>,
    ServiceImpl<UserFeedbackMapper, UserFeedback>()
