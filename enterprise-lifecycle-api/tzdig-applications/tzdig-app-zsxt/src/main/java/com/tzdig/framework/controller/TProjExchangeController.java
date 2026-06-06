package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjExchange;
import com.tzdig.framework.mybatis.service.zsxt.ITProjExchange;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import com.tzdig.framework.web.exception.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "汇率管理")
@RestController
@RequestMapping("tProjExchange")
public class TProjExchangeController {

    @Resource
    private ITProjExchange service;

    /**
     * 列表分页查询
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjExchange> list(
            Pageable pageable,
            @RequestBody TProjExchange entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        queryWrapper.eq("b_year",entity.getBYear(),!ObjectUtils.isEmpty(entity.getBYear()));
        queryWrapper.orderBy(TProjExchange::getCreateTime).desc();
        Page<TProjExchange> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjExchange> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增
     */
    
    @Operation(summary = "新增")
    @PostMapping("/create")
    public Boolean create(@RequestBody TProjExchange entity) {
        return  service.save(entity);
    }

    /**
     * 修改信息
     */
    
    @Operation(summary = "修改")
    @PostMapping("/update")
    public Boolean update(@RequestBody TProjExchange entity) {
        if(ObjectUtils.isEmpty(entity.getId())){
            throw new ApiException("id不能为空",HttpStatus.INTERNAL_SERVER_ERROR);
        }
       return service.updateById(entity);
    }

    /**
     * 删除
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }
}
