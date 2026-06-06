package com.tzdig.framework.service.impl;

import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper;
import com.tzdig.framework.mybatis.service.zsxt.ITProjExchange;
import com.tzdig.framework.mybatis.service.zsxt.ITProjProjectSigned;
import com.tzdig.framework.service.ProjectSignedFzService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

/**
 * 签约项目业务 Service 实现类
 */
@Service
public class ProjectSignedFzServiceImpl implements ProjectSignedFzService {

    @Resource
    private ITProjProjectSigned itProjProjectSignedService;

    @Resource
    private ITProjExchange itProjExchangeService;

    @Resource
    private TProjProjectSignedMapper signedMapper;


}
