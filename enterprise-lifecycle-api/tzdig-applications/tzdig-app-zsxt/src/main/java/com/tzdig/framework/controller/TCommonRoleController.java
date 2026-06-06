package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TCommonRole;
import com.tzdig.framework.mybatis.service.zsxt.ITCommonRole;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

/**
 * 角色模块控制器
 */
@Tag(name = "角色模块")
@RestController
@RequestMapping("tCommonRole")
public class TCommonRoleController {

    @Resource
    private ITCommonRole service;

    /**
     * 分页查询角色列表
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TCommonRole> list(
            Pageable pageable,
            @RequestBody(required = false) TCommonRole entity) {
        
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null) {
            queryWrapper.where(TCommonRole::getRoleName).like(entity.getRoleName());
        }
        
        Page<TCommonRole> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TCommonRole> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增角色
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TCommonRole entity) {
        service.save(entity);
    }

    /**
     * 修改角色信息
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TCommonRole entity) {
        entity.setId(id);
        service.updateById(entity);
    }

    /**
     * 删除角色
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }
}
