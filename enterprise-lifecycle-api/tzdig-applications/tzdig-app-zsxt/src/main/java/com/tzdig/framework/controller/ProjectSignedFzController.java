package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TFile;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITFile;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import com.tzdig.framework.service.ProjectSignedFzService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

/**
 * 附件模块控制器
 */
@Tag(name = "签约项目附则")
@RestController
@RequestMapping("t_project_signed_fz")
public class ProjectSignedFzController {

    @Resource
    private ProjectSignedFzService service;


}
