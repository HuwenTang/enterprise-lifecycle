package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvestCheckLog;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITBizInvestCheckLog;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.web.bind.annotation.*;

/**
 * 招商投资审核日志控制器
 */
@Tag(name = "招商投资审核日志")
@RestController
@RequestMapping("tBizInvestCheckLog")
public class TBizInvestCheckLogController {

    @Resource
    private ITBizInvestCheckLog service;

    /**
     * 分页查询审核日志列表
     */
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TBizInvestCheckLog> list(
            Pageable pageable,
            @RequestBody(required = false) TBizInvestCheckLog entity) {
        QueryWrapper queryWrapper = buildQueryWrapper(entity);
        Page<TBizInvestCheckLog> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TBizInvestCheckLog> resultPage = service.page(page, queryWrapper);
        return PageableResult.of(resultPage);
    }

    private QueryWrapper buildQueryWrapper(TBizInvestCheckLog entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity == null) {
            return queryWrapper;
        }

        if (ObjectUtils.isNotEmpty(entity.getInvestId())) {
            queryWrapper.eq(TBizInvestCheckLog::getInvestId, entity.getInvestId());
        }
        if (ObjectUtils.isNotEmpty(entity.getCt())) {
            queryWrapper.eq(TBizInvestCheckLog::getCt, entity.getCt());
        }
        if (ObjectUtils.isNotEmpty(entity.getManagerId())) {
            queryWrapper.eq(TBizInvestCheckLog::getManagerId, entity.getManagerId());
        }
        if (ObjectUtils.isNotEmpty(entity.getManagerName())) {
            queryWrapper.like(TBizInvestCheckLog::getManagerName, entity.getManagerName());
        }
        if (ObjectUtils.isNotEmpty(entity.getDesc())) {
            queryWrapper.like(TBizInvestCheckLog::getDesc, entity.getDesc());
        }
        if (ObjectUtils.isNotEmpty(entity.getBStatus())) {
            queryWrapper.eq(TBizInvestCheckLog::getBStatus, entity.getBStatus());
        }
        if (ObjectUtils.isNotEmpty(entity.getAStatus())) {
            queryWrapper.eq(TBizInvestCheckLog::getAStatus, entity.getAStatus());
        }
        return queryWrapper;
    }

    /**
     * 获取详情
     */
    @Operation(summary = "详情")
    @GetMapping("{id}")
    public TBizInvestCheckLog getInfo(@PathVariable("id") String id) {
        return service.getById(id);
    }

    /**
     * 新增审核日志
     */
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TBizInvestCheckLog entity) {

        service.save(entity);
    }

    /**
     * 修改审核日志
     */
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TBizInvestCheckLog entity) {
        entity.setId(id);
        service.updateById(entity);
    }

    /**
     * 删除审核日志
     */
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }
}
