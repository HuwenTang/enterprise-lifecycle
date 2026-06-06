package com.tzdig.framework.service.impl;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TCommonManager;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITCommonManager;
import com.tzdig.framework.security.service.UserService;
import com.tzdig.framework.service.ITCommonManagerService;
import com.tzdig.framework.util.UserInfoUtil;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

/**
 * 通用管理员业务逻辑实现
 */
@Service
public class TCommonManagerServiceImpl implements ITCommonManagerService {

    @Resource
    private ITCommonManager service;

    @Override
    public PageableResult<TCommonManager> list(Pageable pageable, TCommonManager entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        Page<TCommonManager> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TCommonManager> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

}
