package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjType;
import com.tzdig.framework.mybatis.service.zsxt.ITProjType;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@Tag(name = "项目类型")
@RestController
@RequestMapping("tProjType")
public class TProjTypeController {

    @Resource
    private ITProjType service;

    /**
     * 列表分页查询
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjType> list(
            Pageable pageable,
            @RequestBody(required = false) TProjType entity) {

        QueryWrapper queryWrapper = new QueryWrapper();
        Page<TProjType> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjType> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TProjType entity) {
        service.save(entity);
    }

    /**
     * 修改信息
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TProjType entity) {
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
     * 获取项目类型下拉树数据（原 getProjType 逻辑）
     * 提取自老系统：获取全量类型数据，并组装成带 children 属性的层级树结构
     */
    
    @Operation(summary = "获取行业名称下拉树")
    @PostMapping("/getProjType")
    public List<Map<String, Object>> getProjType() {
        // 1. 从数据库获取所有数据
        List<TProjType> allOrg = service.list();

        // 2. 将实体转换为基础 Map 集合
        List<HashMap<String, Object>> mapList = new ArrayList<>();
        if (allOrg != null) {
            for (TProjType entity : allOrg) {
                HashMap<String, Object> map = new HashMap<>();
                map.put("_code", entity.getCode());
                map.put("_name", entity.getName());
                map.put("p_id", entity.getPId());
                map.put("id", entity.getId());
                mapList.add(map);
            }
        }

        // 3. 构建树形结构，老代码中根节点标识从 "0" 开始
        return getChildTree(mapList, "0");
    }

    /**
     * 递归获取子节点构建下级树
     */
    private List<Map<String, Object>> getChildTree(
            List<HashMap<String, Object>> allOrg,
            String parentOrgCode) {

        List<Map<String, Object>> childList = new ArrayList<>();
        Iterator<HashMap<String, Object>> iterator = allOrg.iterator();

        while (iterator.hasNext()) {
            HashMap<String, Object> entity = iterator.next();
            if (!parentOrgCode.equals((String) entity.get("p_id"))) {
                continue;
            }
            // 构建数据
            Map<String, Object> node1 = new HashMap<>();
            node1.put("id", (String) entity.get("_code"));
            // 节点数据名称拼接格式： 编码-名称
            node1.put("name", (String) entity.get("_code") + "-" + (String) entity.get("_name"));
            node1.put("p_id", (String) entity.get("p_id"));
            node1.put("_id", entity.get("_id"));
            node1.put("open", false); // 是否展开
            node1.put("checked", false);
            childList.add(node1);

            // 移除本次选择匹配的节点，减少后续遍历
            iterator.remove();
        }

        for (Map<String, Object> vo : childList) {
            // 递归获取子节点
            List<Map<String, Object>> children = getChildTree(allOrg, (String) vo.get("id"));
            if (children != null && !children.isEmpty()) {
                vo.put("children", children);
            }
        }
        return childList.isEmpty() ? null : childList;
    }
}
