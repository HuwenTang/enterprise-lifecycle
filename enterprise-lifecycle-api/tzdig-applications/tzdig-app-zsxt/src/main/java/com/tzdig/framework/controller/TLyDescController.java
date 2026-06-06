package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.model.dto.TLyDescDTO;
import com.tzdig.framework.mybatis.entity.zsxt.TLy;
import com.tzdig.framework.mybatis.entity.zsxt.TLyDesc;
import com.tzdig.framework.mybatis.service.zsxt.ITLy;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITLyDesc;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

/**
 * 留言处理记录控制器
 */
@Tag(name = "留言处理记录")
@RestController
@RequestMapping("tLyDesc")
public class TLyDescController {

    @Resource
    private ITLyDesc service;

    @Resource
    private ITLy lyService;

    /**
     * 分页查询处理记录列表
     */
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TLyDescDTO> list(
            Pageable pageable,
            @RequestBody(required = false) TLyDescDTO entity) {
        QueryWrapper queryWrapper = buildQueryWrapper(entity);
        Page<TLyDesc> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TLyDesc> resultPage = service.page(page, queryWrapper);
        List<TLyDescDTO> records = resultPage.getRecords()
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

    private QueryWrapper buildQueryWrapper(TLyDescDTO entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity == null) {
            return queryWrapper;
        }

        if (ObjectUtils.isNotEmpty(entity.getLyId())) {
            queryWrapper.eq(TLyDesc::getLyId, entity.getLyId());
        }
        if (ObjectUtils.isNotEmpty(entity.getDescContent())) {
            queryWrapper.like(TLyDesc::getDescContent, entity.getDescContent());
        }
        if (ObjectUtils.isNotEmpty(entity.getCt())) {
            queryWrapper.eq(TLyDesc::getCt, entity.getCt());
        }
        if (ObjectUtils.isNotEmpty(entity.getClEr())) {
            queryWrapper.like(TLyDesc::getClEr, entity.getClEr());
        }
        return queryWrapper;
    }

    /**
     * 获取详情
     */
    @Operation(summary = "详情")
    @GetMapping("{id}")
    public TLyDescDTO getInfo(@PathVariable("id") String id) {
        return toDTO(service.getById(id));
    }

    /**
     * 新增处理记录
     */
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TLyDescDTO entity) {
        String realName = getUserAccount().getRealName();
        entity.setClEr(realName);
        service.save(toEntity(entity));

        if (ObjectUtils.isNotEmpty(entity.getLyId())) {
            TLy ly = lyService.getById(entity.getLyId());
            if (ly != null) {
                ly.setClIs(1);
                ly.setClTime(LocalDateTime.now());
                ly.setClEr(realName);
                ly.setClDesc(entity.getDescContent());
                lyService.updateById(ly);
            }
        }
    }

    /**
     * 修改处理记录
     */
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TLyDescDTO entity) {
        TLyDesc lyDesc = toEntity(entity);
        lyDesc.setId(id);
        service.updateById(lyDesc);
    }

    /**
     * 删除处理记录
     */
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }

    private TLyDescDTO toDTO(TLyDesc entity) {
        if (entity == null) {
            return null;
        }
        TLyDescDTO dto = new TLyDescDTO();
        BeanUtils.copyProperties(entity, dto);
        if (entity.getCt() != null) {
            dto.setCt(entity.getCt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
        return dto;
    }

    private TLyDesc toEntity(TLyDescDTO dto) {
        if (dto == null) {
            return null;
        }
        TLyDesc entity = new TLyDesc();
        BeanUtils.copyProperties(dto, entity);
        entity.setCt(LocalDateTime.now());
        return entity;
    }
}
