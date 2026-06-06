package com.tzdig.framework.controller;

import cn.hutool.core.util.ObjectUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjSource;
import com.tzdig.framework.mybatis.service.zsxt.ITProjSource;
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

@Tag(name = "项目来源")
@RestController
@RequestMapping("tProjSource")
public class TProjSourceController {

    @Resource
    private ITProjSource service;

    /**
     * 列表分页查询
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjSource> list(
            Pageable pageable,
            @RequestBody(required = false) TProjSource entity) {
        
        QueryWrapper queryWrapper = new QueryWrapper();
        Page<TProjSource> page = new Page<>(pageable.getPageNumber(), 500);
        if (ObjectUtil.isNotEmpty(entity.getName())) {
            queryWrapper.like("name",entity.getName());
        }
        Page<TProjSource> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TProjSource entity) {
        service.save(entity);
    }

    /**
     * 修改信息
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TProjSource entity) {
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

    /**
     * 根据名称模糊查询项目来源列表（原 searchProjSourceList 逻辑）
     * 提取自老系统：若 name 不为空则进行名称的模糊查询，否则查询全部列表数据（老系统限制了最多取1000条）
     */
    
    @Operation(summary = "查询项目来源列表")
    @PostMapping("/searchProjSourceList")
    public java.util.List<TProjSource> searchProjSourceList(@RequestBody(required = false) TProjSource entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        // 如果前端传了 name 参数，则进行模糊查询
        if (entity != null && entity.getName() != null && !entity.getName().trim().isEmpty()) {
            queryWrapper.where(TProjSource::getName).like(entity.getName());
        }
        // 老代码里固定了 new Page(0, 1000)，为了兼容老系统的数据量限制
        queryWrapper.limit(1000);
        
        return service.list(queryWrapper);
    }
}
