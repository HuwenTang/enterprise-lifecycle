package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.model.vo.TProjBusinessTripProjectDetailsVO;
import com.tzdig.framework.mybatis.bo.TProjBusinessTripProjectDetailsBO;
import com.tzdig.framework.mybatis.dao.TProjBusinessTripProjectDAO;
import com.tzdig.framework.mybatis.entity.zsxt.TProjBusinessTripProject;
import com.tzdig.framework.mybatis.entity.zsxt.TProjProjectSigned;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjBusinessTripProjectMapper;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjBusinessTripProject;
import com.tzdig.framework.mybatis.service.zsxt.ITProjProjectSigned;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import com.tzdig.framework.web.exception.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 因公出访关联项目模块控制器
 */
@Tag(name = "因公出访关联项目模块")
@RestController
@RequestMapping("tProjBusinessTripProject")
public class TProjBusinessTripProjectController {

    @Resource
    private ITProjBusinessTripProject service;


    @Resource
    private TProjBusinessTripProjectDAO dao;

    @Resource
    private TProjBusinessTripProjectMapper mapper;

    /**
     * 分页查询关联项目绑定列表
     *
     * @param pageable 分页参数
     * @param entity   查询条件（通常按 tripId 过滤）
     * @return 分页结果
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjBusinessTripProject> list(Pageable pageable, @RequestBody TProjBusinessTripProject entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null && entity.getTripId() != null) {
            queryWrapper.where(TProjBusinessTripProject::getTripId).eq(entity.getTripId());
        }
        Page<TProjBusinessTripProject> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjBusinessTripProject> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 分页查询项目详细信息 (直接通过 DAO SQL 关联查询)
     */
    
    @Operation(summary = "分页展示项目列表")
    @PostMapping("/listProjectDetails")
    @PageableQuery
    public PageableResult<TProjBusinessTripProjectDetailsVO> listProjectDetails(Pageable pageable, @RequestBody TProjBusinessTripProject entity) {
        if (entity == null || entity.getTripId() == null) {
            return PageableResult.empty(pageable);
        }

        // 1. 构造分页对象
        Page<TProjBusinessTripProjectDetailsBO> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());

        // 手动获取总数并填入 page，提供元数据
        long totalCount = dao.listProjectDetailsCount(entity.getTripId());
        page.setTotalRow(totalCount);

        // 计算偏移量并执行手动分页查询
        long offset = (pageable.getPageNumber() - 1) * pageable.getPageSize();
        List<TProjBusinessTripProjectDetailsBO> records = dao.listProjectDetails(offset, pageable.getPageSize(), entity.getTripId());
        page.setRecords(records);

        // 2. 将 BO 结果集映射为最终的 VO
        Page<TProjBusinessTripProjectDetailsVO> voPage = page.map(bo -> {
            TProjBusinessTripProjectDetailsVO vo = new TProjBusinessTripProjectDetailsVO();
            BeanUtils.copyProperties(bo, vo);
            return vo;
        });
        return PageableResult.of(voPage);
    }

    /**
     * 查询未绑定的项目分页列表 (排除特定 tripId 已绑定的项目)
     *
     * @param pageable 分页参数
     * @param params   查询参数 (包含 tripId 和可选的 projectName)
     * @return 分页项目详情列表
     */
    
    @Operation(summary = "查询未绑定项目列表")
    @PostMapping("/listUnboundProjects")
    @PageableQuery
    public PageableResult<TProjBusinessTripProjectDetailsVO> listUnboundProjects(
            Pageable pageable, @RequestBody Map<String, Object> params) {
        if (ObjectUtils.isEmpty(params.get("tripId"))) {
            return PageableResult.empty(pageable);
        }
        Long tripId = Long.valueOf(params.get("tripId").toString());
        String projectName = (String) params.get("projectName");

        Page<TProjBusinessTripProjectDetailsBO> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());

        // 手动获取总数并填入 page，提供元数据
        long totalCount = dao.listUnboundProjectsCount(tripId, projectName);
        page.setTotalRow(totalCount);

        // 计算偏移量并执行手动分页查询
        long offset = (pageable.getPageNumber() - 1) * pageable.getPageSize();
        List<TProjBusinessTripProjectDetailsBO> records = dao.listUnboundProjects(offset, pageable.getPageSize(), tripId, projectName);
        page.setRecords(records);

        Page<TProjBusinessTripProjectDetailsVO> voPage = page.map(bo -> {
            TProjBusinessTripProjectDetailsVO vo = new TProjBusinessTripProjectDetailsVO();
            BeanUtils.copyProperties(bo, vo);
            return vo;
        });

        return PageableResult.of(voPage);
    }

    /**
     * 绑定项目到出访记录
     *
     * @param entity 绑定实体
     */
    
    @Operation(summary = "新增（绑定项目）")
    @PostMapping("/create")
    public Boolean create(@RequestBody TProjBusinessTripProject entity) {
        if (ObjectUtils.isEmpty(entity.getTripId()) || ObjectUtils.isEmpty(entity.getProjSignedId())) {
            throw new ApiException("参数不完整", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // 校验是否已存在绑定关系
        QueryWrapper queryWrapper = new QueryWrapper();
        queryWrapper.where(TProjBusinessTripProject::getTripId).eq(entity.getTripId())
                    .and(TProjBusinessTripProject::getProjSignedId).eq(entity.getProjSignedId());
        long count = service.count(queryWrapper);
        if (count > 0) {
            throw new ApiException("该项目已绑定到此出访记录，请勿重复操作", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return service.save(entity);
    }

    /**
     * 解除绑定关联项目
     *
     * @param tripId       出访记录 ID
     * @param projSignedId 项目签约 ID
     */
    
    @Operation(summary = "删除（取消绑定）")
    @DeleteMapping("/delete/{tripId}/{projSignedId}")
    public void delete(@PathVariable("tripId") Long tripId, @PathVariable("projSignedId") Long projSignedId) {
        mapper.deleteByTripIdAndProjSignedId(tripId, projSignedId);
    }
}
