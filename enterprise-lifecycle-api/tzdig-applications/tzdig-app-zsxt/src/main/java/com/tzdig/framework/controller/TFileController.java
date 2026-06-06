package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TFile;
import com.tzdig.framework.mybatis.service.zsxt.ITFile;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

/**
 * 附件模块控制器
 */
@Tag(name = "附件模块")
@RestController
@RequestMapping("tFile")
public class TFileController {

    @Resource
    private ITFile service;

    /**
     * 附件列表分页查询
     * @param pageable 分页参数
     * @param entity 查询条件
     * @return 分页结果
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TFile> list(
            Pageable pageable,
            @RequestBody(required = false) TFile entity) {
        
        QueryWrapper queryWrapper = new QueryWrapper();
        // 根据传入实体的非空字段构建查询条件，模仿常用逻辑
        if (entity != null) {
            queryWrapper.where(TFile::getCateCode).eq(entity.getCateCode())
                    .and(TFile::getMainId).eq(entity.getMainId())
                    .and(TFile::getName).like(entity.getName());
        }
        
        Page<TFile> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TFile> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增附件
     * @param entity 附件实体
     */
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TFile entity) {
        service.save(entity);
    }

    /**
     * 修改附件信息
     * @param id 主键ID
     * @param entity 附件实体
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TFile entity) {
        entity.setId(id);
        service.updateById(entity);
    }

    /**
     * 删除附件
     * @param id 主键ID
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }
}
