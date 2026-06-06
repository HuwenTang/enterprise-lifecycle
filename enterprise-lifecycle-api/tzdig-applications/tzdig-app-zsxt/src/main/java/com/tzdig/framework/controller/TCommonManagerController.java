package com.tzdig.framework.controller;

import com.tzdig.framework.mybatis.entity.zsxt.TCommonManager;
import com.tzdig.framework.mybatis.service.zsxt.ITCommonManager;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.service.ITCommonManagerService;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

/**
 * 通用管理员模块控制器
 */
@Tag(name = "通用管理员模块")
@RestController
@RequestMapping("tCommonManager")
public class TCommonManagerController {

    @Resource
    private ITCommonManager service;

    @Resource
    private ITCommonManagerService commonManagerService;

    /**
     * 分页查询管理员列表
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TCommonManager> list(
            Pageable pageable,
            @RequestBody(required = false) TCommonManager entity) {
        return commonManagerService.list(pageable, entity);
    }

    /**
     * 新增管理员
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TCommonManager entity) {
        service.save(entity);
    }

    /**
     * 修改管理员信息
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TCommonManager entity) {
        entity.setId(id);
        service.updateById(entity);
    }

    /**
     * 删除管理员
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }
}
