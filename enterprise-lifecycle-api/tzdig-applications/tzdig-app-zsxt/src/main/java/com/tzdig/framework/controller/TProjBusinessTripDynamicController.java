package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjBusinessTripDynamic;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjBusinessTripDynamic;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import com.tzdig.framework.web.exception.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 因公出访进展动态模块控制器
 */
@Tag(name = "因公出访进展动态模块")
@RestController
@RequestMapping("tProjBusinessTripDynamic")
public class TProjBusinessTripDynamicController {

    @Resource
    private ITProjBusinessTripDynamic service;

    /**
     * 分页查询进展动态列表
     *
     * @param pageable 分页参数
     * @param entity   查询条件（通常按 tripId 过滤）
     * @return 分页结果
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjBusinessTripDynamic> list(Pageable pageable, @RequestBody TProjBusinessTripDynamic entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null && entity.getTripId() != null) {
            queryWrapper.where(TProjBusinessTripDynamic::getTripId).eq(entity.getTripId());
        }
        queryWrapper.orderBy(TProjBusinessTripDynamic::getCreateTime).desc();
        Page<TProjBusinessTripDynamic> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjBusinessTripDynamic> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 根据 tripId 获取所有动态列表 (不分页)
     *
     * @param tripId 出访记录 ID
     * @return 动态列表
     */
    
    @Operation(summary = "全部动态列表")
    @GetMapping("/listAll/{tripId}")
    public List<TProjBusinessTripDynamic> listAll(@PathVariable("tripId") String tripId) {
        QueryWrapper queryWrapper = new QueryWrapper();
        queryWrapper.where(TProjBusinessTripDynamic::getTripId).eq(tripId);
        queryWrapper.orderBy(TProjBusinessTripDynamic::getCreateTime).desc();
        return service.list(queryWrapper);
    }

    /**
     * 新增进展动态
     *
     * @param entity 动态实体
     */
    
    @Operation(summary = "新增")
    @PostMapping("/create")
    public Boolean create(@RequestBody TProjBusinessTripDynamic entity) {
        entity.setFillTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
       return service.save(entity);
    }

    /**
     * 修改进展动态记录
     * @param entity 动态实体
     */
    
    @Operation(summary = "修改")
    @PostMapping("/update")
    public Boolean update(@RequestBody TProjBusinessTripDynamic entity) {
      if(ObjectUtils.isEmpty(entity.getId())){
          throw new ApiException("id参数不能为空", HttpStatus.INTERNAL_SERVER_ERROR);
      }
       return service.updateById(entity);
    }

    /**
     * 删除进展动态记录
     *
     * @param id 主键 ID
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }

    /**
     * 根据 ID 获取进展动态详情
     *
     * @param id 主键 ID
     * @return 动态详情
     */
    
    @Operation(summary = "详情")
    @GetMapping("/getById/{id}")
    public TProjBusinessTripDynamic getById(@PathVariable("id") String id) {
        return service.getById(id);
    }
}
