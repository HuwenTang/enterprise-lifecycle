package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjScore;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjScore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "项目加分")
@RestController
@RequestMapping("tProjScore")
public class TProjScoreController {

    @Resource
    private ITProjScore service;

    /**
     * 分页查询项目加分列表
     */
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjScore> list(Pageable pageable, @RequestBody TProjScore entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null) {
            if (entity.getId() != null) {
                queryWrapper.eq(TProjScore::getId, entity.getId());
            }
            if (entity.getYear() != null) {
                queryWrapper.eq(TProjScore::getYear, entity.getYear());
            }
            if (entity.getZoneCode() != null && !entity.getZoneCode().isEmpty()) {
                queryWrapper.eq(TProjScore::getZoneCode, entity.getZoneCode());
            }
            if (entity.getDistrictCode() != null && !entity.getDistrictCode().isEmpty()) {
                queryWrapper.eq(TProjScore::getDistrictCode, entity.getDistrictCode());
            }
        }
        queryWrapper.orderBy("create_time desc");

        Page<TProjScore> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjScore> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 根据ID查询详情
     */
    @Operation(summary = "详情")
    @GetMapping("{id}")
    public TProjScore getInfo(@PathVariable("id") String id) {
        return service.getById(id);
    }

    /**
     * 新增或修改项目加分
     */
    @Operation(summary = "保存")
    @PostMapping
    public void save(@RequestBody TProjScore entity) {
        if (entity.getId() == null) {
            entity.setCreateTime(LocalDateTime.now());
            service.save(entity);
        } else {
            service.updateById(entity);
        }
    }

    /**
     * 批量新增项目加分
     */
    @Operation(summary = "批量新增")
    @PostMapping("/batch")
    public void createBatch(@RequestBody List<TProjScore> entities) {
        service.saveBatch(entities);
    }

    /**
     * 修改项目加分
     */
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(@PathVariable("id") String id, @RequestBody TProjScore entity) {
        entity.setId(id);
        service.updateById(entity);
    }

    /**
     * 删除项目加分
     */
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }
}
