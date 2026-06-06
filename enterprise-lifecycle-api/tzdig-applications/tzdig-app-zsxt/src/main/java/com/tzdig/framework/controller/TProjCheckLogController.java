package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjCheckLog;
import com.tzdig.framework.mybatis.service.zsxt.ITProjCheckLog;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "项目审核日志")
@RestController
@RequestMapping("tProjCheckLog")
public class TProjCheckLogController {

    @Resource
    private ITProjCheckLog service;

    /**
     * 分页查询审核日志列表
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjCheckLog> list(
            Pageable pageable,
            @RequestBody TProjCheckLog entity) {

        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null) {
            if (entity.getProjName() != null && !entity.getProjName().isEmpty()) {
                queryWrapper.like(TProjCheckLog::getProjName, entity.getProjName());
            }
            if (entity.getProjId() != null) {
                queryWrapper.eq(TProjCheckLog::getProjId, entity.getProjId());
            }
            if (entity.getManagerName() != null && !entity.getManagerName().isEmpty()) {
                queryWrapper.like(TProjCheckLog::getManagerName, entity.getManagerName());
            }
            if (entity.getProgress() != null) {
                queryWrapper.eq(TProjCheckLog::getProgress, entity.getProgress());
            }
        }

        queryWrapper.orderBy(TProjCheckLog::getCheckTime).desc();

        Page<TProjCheckLog> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjCheckLog> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增审核日志
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TProjCheckLog entity) {
        service.save(entity);
    }

    /**
     * 获取详情
     */
    
    @Operation(summary = "详情")
    @GetMapping("{id}")
    public TProjCheckLog getInfo(@PathVariable("id") String id) {
        return service.getById(id);
    }

    /**
     * 修改信息
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TProjCheckLog entity) {
        entity.setId(id);
        service.updateById(entity);
    }

    /**
     * 删除
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }
}
