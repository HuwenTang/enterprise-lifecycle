package com.tzdig.framework.controller;

import cn.hutool.core.date.DateUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvestFeedback;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITBizInvestFeedback;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

/**
 * 招商投资反馈控制器
 */
@Tag(name = "招商投资反馈")
@RestController
@RequestMapping("tBizInvestFeedback")
public class TBizInvestFeedbackController {

    @Resource
    private ITBizInvestFeedback service;

    /**
     * 分页查询反馈列表
     */
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TBizInvestFeedback> list(
            Pageable pageable,
            @RequestBody(required = false) TBizInvestFeedback entity) {
        QueryWrapper queryWrapper = buildQueryWrapper(entity);
        Page<TBizInvestFeedback> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TBizInvestFeedback> resultPage = service.page(page, queryWrapper);
        return PageableResult.of(resultPage);
    }

    private QueryWrapper buildQueryWrapper(TBizInvestFeedback entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity == null) {
            return queryWrapper;
        }

        if (ObjectUtils.isNotEmpty(entity.getZoneLinker())) {
            queryWrapper.like(TBizInvestFeedback::getZoneLinker, entity.getZoneLinker());
        }
        if (ObjectUtils.isNotEmpty(entity.getZoneLinkerTel())) {
            queryWrapper.like(TBizInvestFeedback::getZoneLinkerTel, entity.getZoneLinkerTel());
        }
        if (ObjectUtils.isNotEmpty(entity.getCompanyLinker())) {
            queryWrapper.like(TBizInvestFeedback::getCompanyLinker, entity.getCompanyLinker());
        }
        if (ObjectUtils.isNotEmpty(entity.getCompanyTel())) {
            queryWrapper.like(TBizInvestFeedback::getCompanyTel, entity.getCompanyTel());
        }
        if (ObjectUtils.isNotEmpty(entity.getFeedback())) {
            queryWrapper.like(TBizInvestFeedback::getFeedback, entity.getFeedback());
        }
        if (ObjectUtils.isNotEmpty(entity.getFbDate())) {
            queryWrapper.eq(TBizInvestFeedback::getFbDate, entity.getFbDate());
        }
        if (ObjectUtils.isNotEmpty(entity.getCreatorId())) {
            queryWrapper.eq(TBizInvestFeedback::getCreatorId, entity.getCreatorId());
        }
        if (ObjectUtils.isNotEmpty(entity.getCreatorName())) {
            queryWrapper.like(TBizInvestFeedback::getCreatorName, entity.getCreatorName());
        }
        if (ObjectUtils.isNotEmpty(entity.getInvestId())) {
            queryWrapper.eq(TBizInvestFeedback::getInvestId, entity.getInvestId());
        }
        return queryWrapper;
    }

    /**
     * 获取详情
     */
    @Operation(summary = "详情")
    @GetMapping("{id}")
    public TBizInvestFeedback getInfo(@PathVariable("id") String id) {
        return service.getById(id);
    }

    /**
     * 新增反馈信息
     */
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TBizInvestFeedback entity) {
        entity.setCreatorName(getUserAccount().getRealName());
        entity.setFbDate(DateUtil.format(DateUtil.date(), "yyyy-MM-dd"));
        entity.setCreatorId(getUserAccount().getId());
        service.save(entity);
    }

    /**
     * 修改反馈信息
     */
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TBizInvestFeedback entity) {
        entity.setId(id);
        entity.setFbDate(DateUtil.format(DateUtil.date(), "yyyy-MM-dd"));
        service.updateById(entity);
    }

    /**
     * 删除反馈信息
     */
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }
}
