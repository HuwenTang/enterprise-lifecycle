package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.model.vo.TProjIndustryVO;
import com.tzdig.framework.mybatis.entity.zsxt.TProjIndustry;
import com.tzdig.framework.mybatis.service.zsxt.ITProjIndustry;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "行业模块")
@RestController
@RequestMapping("tProjIndustry")
public class TProjIndustryController {

    @Resource
    private ITProjIndustry service;

    /**
     * 列表分页查询
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjIndustry> list(
            Pageable pageable,
            @RequestBody(required = false) TProjIndustry entity) {

        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null) {
            if (ObjectUtils.isNotEmpty(entity.getName())) {
                queryWrapper.where(TProjIndustry::getName).like(entity.getName());
            }
            if (ObjectUtils.isNotEmpty(entity.getCode())) {
                queryWrapper.and(TProjIndustry::getCode).eq(entity.getCode());
            }
            if (ObjectUtils.isNotEmpty(entity.getPId())) {
                queryWrapper.and(TProjIndustry::getPId).eq(entity.getPId());
            }
        }
        queryWrapper.orderBy(TProjIndustry::getOrderIdx).asc();

        Page<TProjIndustry> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjIndustry> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TProjIndustry entity) {
        service.save(entity);
    }

    /**
     * 修改信息
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TProjIndustry entity) {
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
     * 获取项目行业下拉树数据
     * 重构后：使用 Stream 构建两级树形结构，返回对象而非 Map。
     */
    
    @Operation(summary = "获取项目行业下拉树")
    @PostMapping("/getIndustryTreeSelect")
    public List<TProjIndustryVO> getIndustryTreeSelect() {
        // 1. 获取所有状态正常的行业数据，并排序
        QueryWrapper queryWrapper = new QueryWrapper();
        queryWrapper.where(TProjIndustry::getStatus).eq(1);
        queryWrapper.orderBy(TProjIndustry::getOrderIdx).asc();
        List<TProjIndustry> allList = service.list(queryWrapper);

        if (ObjectUtils.isEmpty(allList)) {
            return Collections.emptyList();
        }

        // 2. 构建两级树形结构 (p_id 为 "0" 作为第一级节点)
        return allList.stream()
                .filter(item -> "0".equals(item.getPId()))
                .map(parent -> {
                    TProjIndustryVO parentVO = convertToVO(parent);
                    parentVO.setChildren(allList.stream()
                            .filter(child -> parent.getCode().equals(child.getPId()))
                            .map(this::convertToVO)
                            .collect(Collectors.toList()));
                    return parentVO;
                })
                .collect(Collectors.toList());
    }

    /**
     * 将实体转换为页面所需展示的 VO 对象
     */
    private TProjIndustryVO convertToVO(TProjIndustry entity) {
        TProjIndustryVO vo = new TProjIndustryVO();
        vo.setId(entity.getCode());
        // 格式化名称：code-name
        vo.setName(entity.getCode() + "-" + entity.getName());
        vo.setPId(entity.getPId());
        return vo;
    }

}
