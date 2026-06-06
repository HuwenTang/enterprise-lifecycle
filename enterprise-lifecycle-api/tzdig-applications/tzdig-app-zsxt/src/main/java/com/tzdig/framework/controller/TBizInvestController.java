package com.tzdig.framework.controller;

import cn.hutool.core.collection.CollectionUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.model.dto.TBizInvestDTO;
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvest;
import com.tzdig.framework.mybatis.entity.zsxt.TBizZone;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITBizInvest;
import com.tzdig.framework.mybatis.service.zsxt.ITBizZone;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

/**
 * 招商投资信息控制器
 */
@Tag(name = "招商投资信息")
@RestController
@RequestMapping("tBizInvest")
public class TBizInvestController {

    @Resource
    private ITBizInvest service;

    @Resource
    private TProjProjectSignedMapper signedMapper;

    @Resource
    private ITBizZone zoneService;

    /**
     * 分页查询投资信息列表
     */
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TBizInvestDTO> list(
            Pageable pageable,
            @RequestBody(required = false) TBizInvestDTO entity) {
        QueryWrapper queryWrapper = new QueryWrapper();

        // === 权限过滤：zoneCodes -> t_biz_zone._code ===
        String id = getUserAccount().getId();
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(id);

        // 从 t_biz_zone 获取用户有权限的 _code 列表
        QueryWrapper zoneWrapper = new QueryWrapper();
        if (CollectionUtil.isNotEmpty(zoneCodes)) {
           if (!"001".equals(zoneCodes.get(0))) {
               zoneWrapper.in("dept_code", zoneCodes);
               List<String> _codeList = zoneService.list(zoneWrapper).stream()
                       .map(TBizZone::getCode)
                       .collect(Collectors.toList());
               queryWrapper.in("zone_code", _codeList);
           }
        }

        // === 搜索条件 ===
        if (entity != null) {
            if (entity.getCompanyName() != null) {
                queryWrapper.like("company_name", entity.getCompanyName());
            }
            if (entity.getZoneCode() != null) {
                queryWrapper.eq("zone_code", entity.getZoneCode());
            }
            if (entity.getIndustryCode() != null) {
                queryWrapper.eq("industry_code", entity.getIndustryCode());
            }
            if (entity.getStatus() != null) {
                queryWrapper.eq("status", entity.getStatus());
            }
        }

        Page<TBizInvest> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TBizInvest> resultPage = service.page(page, queryWrapper);

        List<TBizInvestDTO> records = resultPage.getRecords()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return new PageableResult<>(
                resultPage.getPageNumber(),
                resultPage.getPageSize(),
                resultPage.getTotalPage(),
                resultPage.getTotalRow(),
                records
        );
    }

    /**
     * 获取详情
     */
    @Operation(summary = "详情")
    @GetMapping("/getInfo/{id}")
    public TBizInvestDTO getInfo(@PathVariable("id") String id) {
        return toDTO(service.getById(id));
    }

    /**
     * 新增投资信息
     */
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TBizInvest entity) {
        service.save(entity);
    }

    /**
     * 修改投资信息
     */
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(@PathVariable("id") String id, @RequestBody TBizInvest entity) {
        entity.setId(id);
        service.updateById(entity);
    }

    /**
     * 删除投资信息
     */
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }

    private static final DateTimeFormatter CT_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private TBizInvestDTO toDTO(TBizInvest entity) {
        if (entity == null) {
            return null;
        }
        TBizInvestDTO dto = new TBizInvestDTO();
        BeanUtils.copyProperties(entity, dto);
        if (entity.getCt() != null) {
            dto.setCt(entity.getCt().format(CT_FORMATTER));
        }
        return dto;
    }

}
