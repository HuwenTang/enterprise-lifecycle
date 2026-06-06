package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.UserFeedbackComment
import com.tzdig.framework.mybatis.mapper.prime.UserFeedbackCommentMapper
import org.springframework.stereotype.Service

@Service
class IUserFeedbackComment : IService<UserFeedbackComment>,
    ServiceImpl<UserFeedbackCommentMapper, UserFeedbackComment>()
