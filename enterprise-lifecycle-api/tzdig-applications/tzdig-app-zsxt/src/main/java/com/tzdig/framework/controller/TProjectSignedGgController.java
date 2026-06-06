package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjectSignedGg;
import com.tzdig.framework.mybatis.entity.zsxt.TProjectSignedOnline;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjectSignedGg;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import com.tzdig.framework.service.IProjProjectGgService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import lombok.val;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 项目签约工改模块控制器
 */
@Tag(name = "项目签约工改模块")
@RestController
@RequestMapping("tProjectSignedGg")
public class TProjectSignedGgController {

    @Resource
    private ITProjectSignedGg service;

    @Resource
    private IProjProjectGgService ggService;

    /**
     * 分页查询项目工改列表
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjectSignedGg> list(Pageable pageable, @RequestBody(required = false) TProjectSignedGg entity) {

        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null) {
            queryWrapper.where(TProjectSignedGg::getProjectCode).eq(entity.getProjectCode()).and(TProjectSignedGg::getProjectName).like(entity.getProjectName());
        }

        Page<TProjectSignedGg> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjectSignedGg> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    
    @Operation(summary = "列表")
    @PostMapping("/getInfoById")
    @PageableQuery
    public TProjectSignedGg getInfoById(@RequestBody TProjectSignedGg entity) {
        TProjectSignedGg records = service.getOne(new QueryWrapper().eq(TProjectSignedGg::getSignedId, entity.getSignedId()).eq(TProjectSignedGg::getConstructionApprovalId, entity.getConstructionApprovalId()).eq(TProjectSignedOnline::getStatus, 1));
        return records;
    }

    
    @Operation(summary = "根据签约ID查询所有在线签约记录")
    @PostMapping("/findAllBySignedId")
    public List<TProjectSignedGg> findAllBySignedId(@RequestBody TProjectSignedGg entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity.getSignedId() != null) {
            queryWrapper.where(TProjectSignedGg::getSignedId).eq(entity.getSignedId());
        }
        return service.list(queryWrapper);
    }

    /**
     * 新增工改记录
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TProjectSignedGg entity) {
        service.save(entity);
    }

    /**
     * 绑定工改项目
     */
    
    @Operation(summary = "绑定工改项目")
    @PostMapping("/save")
    public void save(@RequestBody TProjectSignedGg entity) {
        ggService.save(entity);
    }

    /**
     * 修改工改记录
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(@PathVariable("id") String id, @RequestBody TProjectSignedGg entity) {
        entity.setId(id);
        service.updateById(entity);
    }

    /**
     * 删除工改记录
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        ggService.removeById(id);
    }
}
