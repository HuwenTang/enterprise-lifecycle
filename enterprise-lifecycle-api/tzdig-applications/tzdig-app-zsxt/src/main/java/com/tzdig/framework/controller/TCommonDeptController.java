package com.tzdig.framework.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.ObjectUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.system.UserAccount;
import com.tzdig.framework.mybatis.entity.zsxt.TCommonDept;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITCommonDept;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

@Tag(name = "功能模块管理")
@RestController
@RequestMapping("tCommonDept")
public class TCommonDeptController {

    @Resource
    private ITCommonDept service;

    @Resource
    private TProjProjectSignedMapper signedMapper;

    /**
     * 列表分页查询
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TCommonDept> list(
            Pageable pageable,
            @RequestBody(required = false) TCommonDept entity) {

        QueryWrapper queryWrapper = new QueryWrapper();
        if (entity != null) {
            // 这里可以根据实际需要添加查询条件，例如模糊查询部门名称
            if (ObjectUtil.isNotEmpty(entity.getDeptName())) {
                queryWrapper.like(TCommonDept::getDeptName, entity.getDeptName());
            }
            if (ObjectUtil.isNotEmpty(entity.getDeptCode())) {
                queryWrapper.eq(TCommonDept::getDeptCode, entity.getDeptCode());

            }
        }

        Page<TCommonDept> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TCommonDept> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TCommonDept entity) {
        service.save(entity);
    }

    /**
     * 获取详情
     */
    
    @Operation(summary = "详情")
    @GetMapping("{id}")
    public TCommonDept getInfo(@PathVariable("id") String id) {
        return service.getById(id);
    }

    /**
     * 修改信息
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TCommonDept entity) {
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
     * 根据父级部门查询子部门列表（原 searchDept 业务逻辑）
     * 提取自老系统：支持分层查询，默认查询根节点，且仅查询状态正常的部门。
     */
    
    @Operation(summary = "查询子部门列表")
    @PostMapping("/searchDept")
    @PageableQuery
    public PageableResult<TCommonDept> searchDept(
            Pageable pageable,
            @RequestBody TCommonDept entity) {

        String pId = entity.getPId();
        if (pId == null || pId.isEmpty()) {
            pId = "0";
        }

        QueryWrapper queryWrapper = new QueryWrapper();
        queryWrapper.where(TCommonDept::getPId).eq(pId);
        queryWrapper.and(TCommonDept::getDeptStatus).eq(1);

        if (!ObjectUtils.isEmpty(entity.getDeptName())) {
            queryWrapper.and(TCommonDept::getDeptName).like(entity.getDeptName());
        }

        queryWrapper.orderBy(TCommonDept::getOrderIdx).asc();

        Page<TCommonDept> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TCommonDept> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 获取部门树形数据（原 getDeptListByPid 业务逻辑）
     * 提取自老系统：用于 jstree 异步加载，支持权限过滤（管理员看全量，普通人看下级）。
     */
    
    @Operation(summary = "获取部门树形数据")
    @PostMapping("/getDeptListByPid")
    public  List<Map<String, Object>> getDeptListByPid(@RequestBody TCommonDept entity) {
        String pid = entity.getPId();
        // 1. 初始化根节点(jstree 特定格式)
        if (pid == null || pid.equals("#")) {
            List<Map<String, Object>> root = new ArrayList<>();
            Map<String, Object> node = new HashMap<>();
            node.put("id", "0");
            node.put("text", "组织机构");
            node.put("children", true);
            node.put("type", "root");
            root.add(node);
            return root;
        }

        String id = getUserAccount().getId();
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(id);
        List<String> townCodes = signedMapper.getTownCodesByUserId(id);

        String userDeptCode = "";
        if (CollectionUtil.isNotEmpty(zoneCodes)) {
            userDeptCode = zoneCodes.get(0);
        }
        if (CollectionUtil.isEmpty(zoneCodes)) {
            userDeptCode = townCodes.get(0);
        }

        // 2. 权限相关处理

        QueryWrapper queryWrapper = new QueryWrapper();

        queryWrapper.where(TCommonDept::getDeptStatus).eq(1);

        if (userDeptCode.length() != 3) {
            // 普通人员权限：一级只能看到自己，后续支流限制在其 deptCode 前缀下
            if ("0".equals(pid)) {
                queryWrapper.and(TCommonDept::getDeptCode).eq(userDeptCode);
            } else {
                queryWrapper.and(TCommonDept::getPId).eq(pid);
                queryWrapper.eq("dept_code", userDeptCode);
            }
        } else {
            // 管理员权限：仅根据 pid 展开
            queryWrapper.and(TCommonDept::getPId).eq(pid);
        }

        queryWrapper.orderBy(TCommonDept::getOrderIdx).asc();
        List<TCommonDept> list = service.list(queryWrapper);


        // 3. 结构转换
        List<Map<String, Object>> nodes = new ArrayList<>();
        for (TCommonDept dept : list) {
            Map<String, Object> attr = new HashMap<>();
            attr.put("id", dept.getDeptCode());
            attr.put("text", dept.getDeptName());
            attr.put("parent", "0".equals(pid) ? "0" : dept.getPId());
            attr.put("children", true);

            // 携带业务数据
            Map<String, Object> data = new HashMap<>();
            data.put("p_id", dept.getPId());
            data.put("lxr", dept.getLinker());
            data.put("lxdh", dept.getLinkTel());
            data.put("dept_desc", dept.getDeptDesc());
            data.put("dept_status", dept.getDeptStatus());
            data.put("order_idx", dept.getOrderIdx());
            attr.put("data", data);

            nodes.add(attr);
        }

        return nodes;
    }

    /**
     * 根据 PID 查询部门（原 getDeptByPidForTreeSelect 逻辑）
     * 
     */
    
    @Operation(summary = "下拉树形选择器查询")
    @PostMapping("/getDeptByPidForTreeSelect")
    public List<TCommonDept> getDeptByPidForTreeSelect(@RequestBody TCommonDept entity) {
        String pId = entity.getPId();
        QueryWrapper queryWrapper = new QueryWrapper();
        queryWrapper.where(TCommonDept::getDeptStatus).eq(1);
        queryWrapper.and(TCommonDept::getPId).eq(pId);
        queryWrapper.orderBy(TCommonDept::getOrderIdx).asc();
        return service.list(queryWrapper);
    }
}
