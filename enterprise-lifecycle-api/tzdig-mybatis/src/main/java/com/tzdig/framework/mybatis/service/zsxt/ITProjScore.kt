package com.tzdig.framework.mybatis.service.zsxt;

import com.mybatisflex.core.service.IService;
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjScore;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjScoreMapper

import org.springframework.stereotype.Service;

@Service
class ITProjScore : IService<TProjScore>,
        ServiceImpl<TProjScoreMapper, TProjScore>()