package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TCommonManagerRole;
import com.tzdig.framework.mybatis.service.zsxt.ITCommonManagerRole;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

/**
 * 管理员角色关联模块控制器
 */
@Tag(name = "管理员角色关联模块")
@RestController
@RequestMapping("tCommonManagerRole")
public class TCommonManagerRoleController {

    @Resource
    private ITCommonManagerRole service;

    /**
     * 分页查询关联关系
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TCommonManagerRole> list(
            Pageable pageable,
            @RequestBody(required = false) TCommonManagerRole entity) {
        
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null) {
            queryWrapper.where(TCommonManagerRole::getManagerId).eq(entity.getManagerId())
                    .and(TCommonManagerRole::getRoleId).eq(entity.getRoleId());
        }
        
        Page<TCommonManagerRole> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TCommonManagerRole> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增关联
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TCommonManagerRole entity) {
        service.save(entity);
    }

    /**
     * 删除关联（注意：此表可能使用复合主键，逻辑需根据实际映射调整）
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }
}
