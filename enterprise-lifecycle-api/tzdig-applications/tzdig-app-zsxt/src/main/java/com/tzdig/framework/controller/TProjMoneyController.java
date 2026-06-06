package com.tzdig.framework.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.ObjectUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.model.dto.ProjMoneyBatchDTO;
import com.tzdig.framework.model.dto.ProjMoneyItemDTO;
import com.tzdig.framework.mybatis.entity.zsxt.TProjMoney;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjMoney;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "项目金额")
@RestController
@RequestMapping("tProjMoney")
public class TProjMoneyController {

    @Resource
    private ITProjMoney service;

    /**
     * 列表分页查询
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjMoney> list(Pageable pageable, @RequestBody(required = false) TProjMoney entity) {

        QueryWrapper queryWrapper = new QueryWrapper();
        Page<TProjMoney> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        queryWrapper.eq("deleted", 0);
        queryWrapper.eq("proj_id", entity.getProjId());
        Page<TProjMoney> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TProjMoney entity) {
        service.save(entity);
    }

    /**
     * 修改信息
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(@PathVariable("id") String id, @RequestBody TProjMoney entity) {
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
     * 保存或更新项目资金拨付信息（原 updateOrSaveBDateAndreceivedMoneys 逻辑）
     * 提取自老系统：传入项目的 proj_id 和一组资金明细，先删除该项目下所有的旧拨付记录，再批量插入新记录。
     */
    
    @Operation(summary = "保存或更新项目资金拨付")
    @PostMapping("/updateOrSaveBDateAndreceivedMoneys")
    @Transactional(rollbackFor = Exception.class) // TODO: 涉及先删后插的原子性操作，建议开启事务
    public void updateOrSaveBDateAndreceivedMoneys(@RequestBody ProjMoneyBatchDTO dto) {

        if (ObjectUtil.isEmpty(dto.getProjId())) {
            throw new RuntimeException("proj_id 不能为空");
        }

        QueryWrapper deleteWrapper = new QueryWrapper();
        deleteWrapper.eq("proj_id", dto.getProjId());
        service.remove(deleteWrapper);
        List<TProjMoney> insertList = new ArrayList<>();
        for (ProjMoneyItemDTO itemObj : dto.getBdateAndReceivedMoneysArrays()) {
            TProjMoney entity = new TProjMoney();
            entity.setProjId(dto.getProjId());
            entity.setBDate(itemObj.getBdate());
            entity.setReceivedMoney(itemObj.getReceivedMoney());
            insertList.add(entity);
        }
        // 老系统里是一条一条 insert，新系统可以直接通过 mybatis-flex 批量保存以提升性能
        if (CollectionUtil.isNotEmpty(insertList)) {
            // TODO: 需核对实体类属性定义解除上方的 setter 屏蔽
            service.saveBatch(insertList);
        }
    }
}
