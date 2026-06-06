package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjectSignedOnline;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjectSignedOnline;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import com.tzdig.framework.service.IProjProjectOnlineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 在线签约审批模块控制器
 */
@Tag(name = "在线签约审批模块")
@RestController
@RequestMapping("tProjectSignedOnline")
public class TProjectSignedOnlineController {

    @Resource
    private ITProjectSignedOnline service;

    @Resource
    private IProjProjectOnlineService onlineService;


    /**
     * 分页查询在线签约审批列表
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjectSignedOnline> list(Pageable pageable, @RequestBody(required = false) TProjectSignedOnline entity) {

        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null) {
            queryWrapper.where(TProjectSignedOnline::getProjectCode).eq(entity.getProjectCode()).and(TProjectSignedOnline::getProjectName).like(entity.getProjectName());
        }

        Page<TProjectSignedOnline> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjectSignedOnline> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    
    @Operation(summary = "列表")
    @PostMapping("/getInfoById")
    @PageableQuery
    public TProjectSignedOnline getInfoById(@RequestBody TProjectSignedOnline entity) {
        TProjectSignedOnline records = service.getOne(new QueryWrapper().eq(TProjectSignedOnline::getSignedId, entity.getSignedId()).eq(TProjectSignedOnline::getOnlineApprovalId, entity.getOnlineApprovalId()).eq(TProjectSignedOnline::getStatus, 1));
        return records;
    }

    
    @Operation(summary = "根据签约ID查询所有在线签约记录")
    @PostMapping("/findAllBySignedId")
    public List<TProjectSignedOnline> findAllBySignedId(@RequestBody TProjectSignedOnline entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity.getSignedId() != null) {
            queryWrapper.where(TProjectSignedOnline::getSignedId).eq(entity.getSignedId());
        }
        return service.list(queryWrapper);
    }

    /**
     * 新增在线签约记录
     */
    
    @Operation(summary = "新增")
    @PostMapping("/save")
    public void create(@RequestBody TProjectSignedOnline entity) {
        onlineService.save(entity);
    }

    /**
     * 修改在线签约记录
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(@PathVariable("id") String id, @RequestBody TProjectSignedOnline entity) {
        entity.setId(id);
        service.updateById(entity);
    }

    /**
     * 删除在线签约记录
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        onlineService.removeById(id);
    }
}
