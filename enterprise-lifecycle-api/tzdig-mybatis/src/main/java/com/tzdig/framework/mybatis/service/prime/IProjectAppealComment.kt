package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.ProjectAppealComment
import com.tzdig.framework.mybatis.mapper.prime.ProjectAppealCommentMapper
import org.springframework.stereotype.Service

@Service
class IProjectAppealComment : IService<ProjectAppealComment>,
    ServiceImpl<ProjectAppealCommentMapper, ProjectAppealComment>()
