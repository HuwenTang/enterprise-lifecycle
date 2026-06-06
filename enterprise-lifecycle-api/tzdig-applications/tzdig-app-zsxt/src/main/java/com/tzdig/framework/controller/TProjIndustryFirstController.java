package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjIndustryFirst;
import com.tzdig.framework.mybatis.service.zsxt.ITProjIndustryFirst;
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

@Tag(name = "主导产业模块")
@RestController
@RequestMapping("tProjIndustryFirst")
public class TProjIndustryFirstController {

    @Resource
    private ITProjIndustryFirst service;

    /**
     * 列表分页查询
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjIndustryFirst> list(
            Pageable pageable,
            @RequestBody(required = false) TProjIndustryFirst entity) {
        
        QueryWrapper queryWrapper = new QueryWrapper();
        Page<TProjIndustryFirst> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjIndustryFirst> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TProjIndustryFirst entity) {
        service.save(entity);
    }

    /**
     * 修改信息
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TProjIndustryFirst entity) {
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
     * 获取所有主导产业（原 getindustryfirst 逻辑）
     * 提取自老系统：查询所有内容并按照 code 排序
     */
    
    @Operation(summary = "获取所有主导产业带排序")
    @PostMapping("/getindustryfirst")
    public java.util.List<TProjIndustryFirst> getIndustryFirst() {
        QueryWrapper queryWrapper = new QueryWrapper();
        // 对应老代码： order by _code
        queryWrapper.orderBy(TProjIndustryFirst::getCode).asc();
        
        // 对应老代码：dao.selectOneTableAllList(null, " order by _code ");
        return service.list(queryWrapper);
    }
}
