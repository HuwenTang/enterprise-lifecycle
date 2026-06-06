package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjTask;
import com.tzdig.framework.mybatis.service.zsxt.ITProjTask;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "项目任务")
@RestController
@RequestMapping("tProjTask")
public class TProjTaskController {

    @Resource
    private ITProjTask service;

    /**
     * 列表分页查询
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjTask> list(
            Pageable pageable,
            @RequestBody(required = false) TProjTask entity) {
        
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null) {
            if (entity.getByear() != null && !entity.getByear().isEmpty()) {
                queryWrapper.eq(TProjTask::getByear, entity.getByear());
            }
            if (entity.getDistrictCode() != null && !entity.getDistrictCode().isEmpty()) {
                queryWrapper.eq(TProjTask::getDistrictCode, entity.getDistrictCode());
            }
            if (entity.getZoneCode() != null && !entity.getZoneCode().isEmpty()) {
                queryWrapper.eq(TProjTask::getZoneCode, entity.getZoneCode());
            }
        }
        Page<TProjTask> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjTask> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TProjTask entity) {
        service.save(entity);
    }

    /**
     * 修改信息
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TProjTask entity) {
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
