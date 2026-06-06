package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjPgyj;
import com.tzdig.framework.mybatis.service.zsxt.ITProjPgyj;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "项目评估意见")
@RestController
@RequestMapping("tProjPgyj")
public class TProjPgyjController {

    @Resource
    private ITProjPgyj service;

    /**
     * 分页查询评估意见列表
     */
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjPgyj> list(Pageable pageable, @RequestBody TProjPgyj entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null) {
            if (entity.getSignedId() != null && !entity.getSignedId().isEmpty()) {
                queryWrapper.eq(TProjPgyj::getSignedId, entity.getSignedId());
            }
            if (entity.getPgbm() != null && !entity.getPgbm().isEmpty()) {
                queryWrapper.like(TProjPgyj::getPgbm, entity.getPgbm());
            }
            if (entity.getName() != null && !entity.getName().isEmpty()) {
                queryWrapper.like(TProjPgyj::getName, entity.getName());
            }
            if (entity.getStatus() != null && !entity.getStatus().isEmpty()) {
                queryWrapper.eq(TProjPgyj::getStatus, entity.getStatus());
            }
        }

        Page<TProjPgyj> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjPgyj> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 根据signedId查询评估意见列表
     */
    @Operation(summary = "根据项目ID查询评估意见")
    @GetMapping("/listBySignedId/{signedId}")
    public List<TProjPgyj> listBySignedId(@PathVariable("signedId") String signedId) {
        QueryWrapper queryWrapper = new QueryWrapper();
        queryWrapper.eq(TProjPgyj::getSignedId, signedId);
        queryWrapper.orderBy("create_time desc");
        return service.list(queryWrapper);
    }

    /**
     * 新增评估意见
     */
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TProjPgyj entity) {
        service.save(entity);
    }

    /**
     * 批量新增评估意见
     */
    @Operation(summary = "批量新增")
    @PostMapping("/batch")
    public void createBatch(@RequestBody List<TProjPgyj> entities) {
        service.saveBatch(entities);
    }

    /**
     * 获取详情
     */
    @Operation(summary = "详情")
    @GetMapping("{id}")
    public TProjPgyj getInfo(@PathVariable("id") String id) {
        return service.getById(id);
    }

    /**
     * 修改信息
     */
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(@PathVariable("id") String id, @RequestBody TProjPgyj entity) {
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
