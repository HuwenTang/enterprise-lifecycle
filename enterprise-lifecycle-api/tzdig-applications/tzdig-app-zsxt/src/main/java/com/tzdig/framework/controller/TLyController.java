package com.tzdig.framework.controller;

import cn.hutool.core.collection.CollectionUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.model.dto.TLyDTO;
import com.tzdig.framework.mybatis.entity.zsxt.TLy;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITLy;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

/**
 * 留言控制器
 */
@Tag(name = "留言管理")
@RestController
@RequestMapping("tLy")
public class TLyController {

    @Resource
    private ITLy service;

    @Resource
    private TProjProjectSignedMapper signedMapper;

    /**
     * 分页查询留言列表
     */
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TLyDTO> list(
            Pageable pageable,
            @RequestBody(required = false) TLyDTO entity) {
        QueryWrapper queryWrapper = buildQueryWrapper(entity);
        Page<TLy> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TLy> resultPage = service.page(page, queryWrapper);

        List<TLyDTO> records = resultPage.getRecords()
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

    private QueryWrapper buildQueryWrapper(TLyDTO entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        String id = getUserAccount().getId();
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(id);
        List<String> townCodes = signedMapper.getTownCodesByUserId(id);
        if (CollectionUtil.isNotEmpty(zoneCodes)) {
            if (!zoneCodes.get(0).equals("001")) {
                queryWrapper.in("dept_code", zoneCodes);
            }
        }
        if (CollectionUtil.isEmpty(zoneCodes)) {
            queryWrapper.in("dept_code", townCodes);
        }
        if (ObjectUtils.isNotEmpty(entity.getComName())) {
            queryWrapper.like(TLy::getComName, entity.getComName());
        }
        if (ObjectUtils.isNotEmpty(entity.getName())) {
            queryWrapper.like(TLy::getName, entity.getName());
        }
        if (ObjectUtils.isNotEmpty(entity.getDescContent())) {
            queryWrapper.like(TLy::getDescContent, entity.getDescContent());
        }
        if (ObjectUtils.isNotEmpty(entity.getStatus())) {
            queryWrapper.eq(TLy::getStatus, entity.getStatus());
        }

        if (ObjectUtils.isNotEmpty(entity.getClIs())) {
            queryWrapper.eq(TLy::getClIs, entity.getClIs());
        }

        if (ObjectUtils.isNotEmpty(entity.getDeptCode())) {
            queryWrapper.eq(TLy::getDeptCode, entity.getDeptCode());
        }
        if (ObjectUtils.isNotEmpty(entity.getLyType())) {
            queryWrapper.eq(TLy::getLyType, entity.getLyType());
        }
        if (ObjectUtils.isNotEmpty(entity.getBeginTime()) && ObjectUtils.isNotEmpty(entity.getEndTime())) {
         LocalDate start = LocalDate.parse(entity.getBeginTime()); // yyyy-MM-dd
               LocalDate end = LocalDate.parse(entity.getEndTime());
               queryWrapper.ge(TLy::getCt, start.atStartOfDay());
               queryWrapper.lt(TLy::getCt, end.plusDays(1).atStartOfDay());
        }
        return queryWrapper;
    }

    /**
     * 获取详情
     */
    @Operation(summary = "详情")
    @GetMapping("{id}")
    public TLyDTO getInfo(@PathVariable("id") String id) {
        return toDTO(service.getById(id));
    }

    /**
     * 新增留言
     */
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TLyDTO entity) {
        service.save(toEntity(entity));
    }

    /**
     * 修改留言
     */
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TLyDTO entity) {
        TLy ly = toEntity(entity);
        ly.setId(id);
        service.updateById(ly);
    }

    /**
     * 删除留言
     */
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }

    private TLyDTO toDTO(TLy entity) {
        if (entity == null) {
            return null;
        }
        TLyDTO dto = new TLyDTO();
        BeanUtils.copyProperties(entity, dto);
        if (entity.getCt() != null) {
            dto.setCt(entity.getCt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
        if (entity.getClTime() != null) {
            dto.setClTime(entity.getClTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
        return dto;
    }

    private TLy toEntity(TLyDTO dto) {
        if (dto == null) {
            return null;
        }
        TLy entity = new TLy();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }
}
