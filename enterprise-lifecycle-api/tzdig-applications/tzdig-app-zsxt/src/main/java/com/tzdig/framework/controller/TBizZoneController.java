package com.tzdig.framework.controller;

import cn.hutool.core.collection.CollectionUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TBizZone;
import com.tzdig.framework.mybatis.entity.zsxt.TCommonDept;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper;
import com.tzdig.framework.mybatis.service.zsxt.ITBizZone;
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

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

@Tag(name = "园区管理")
@RestController
@RequestMapping("tBizZone")
public class TBizZoneController {

    @Resource
    private ITBizZone service;

    @Resource
    private TProjProjectSignedMapper signedMapper;


    /**
     * 列表分页查询
     *
     * @param pageable 分页参数
     * @param entity   实体查询参数
     * @return 分页结果
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TBizZone> list(
            Pageable pageable,
            @RequestBody(required = false) TBizZone entity) {
        
        QueryWrapper queryWrapper = new QueryWrapper();
        Page<TBizZone> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TBizZone> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 新增
     *
     * @param entity 实体
     */
    
    @Operation(summary = "新增")
    @PostMapping
    public void create(@RequestBody TBizZone entity) {
        service.save(entity);
    }

    /**
     * 修改信息
     *
     * @param id     ID
     * @param entity 实体
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public void update(
            @PathVariable("id") String id,
            @RequestBody TBizZone entity) {
        // 如果基类Id字段类型兼容，可显式设置
        // entity.setId(id);
        service.updateById(entity);
    }

    /**
     * 删除
     *
     * @param id ID
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }

    /**
     * 根据父级节点异步获取园区树的下一级（原 getZoneTreeListByPid 逻辑）
     * 提取自老系统：如果传入 "#" 或 null，返回固定的根节点；否则根据 p_code 查询直接子节点，并组装特定的属性标记 children=true
     */
    
    @Operation(summary = "异步获取园区树层级数据")
    @PostMapping("/getZoneTreeListByPid")
    public Object getZoneTreeListByPid(@RequestBody(required = false)TBizZone dto) {
          String pid = dto.getPId();
        // 1. 如果是初始加载（pid 等于 # 或 null），老系统返回固定根节点
        if (pid == null || "#".equals(pid)) {
          Map<String, Object> root = new HashMap<>();
            root.put("id", "0");
            root.put("text", "园区");
            root.put("children", true);
            root.put("type", "root");
            return Collections.singletonList(root);
        }

        // 2. 根据父级编码获取子节点
        // TODO: 老系统有一段被注释的数据权限隔离逻辑（getZoneListByPidAndCode...dept_code），如需数据隔离请结合 SaToken 在此处补充过滤条件

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

        QueryWrapper queryWrapper = new QueryWrapper();
        // 老代码前端入参虽然叫 p_id，但它的值“0”、“001”等实际对应的是数据库里的 p_code 字段
//        queryWrapper.eq(TBizZone::getPCode, pid);


        if (userDeptCode.length() != 3) {
            // 普通人员权限：一级只能看到自己，后续支流限制在其 deptCode 前缀下
            if ("0".equals(pid)) {
                queryWrapper.and(TBizZone::getDeptCode).eq(userDeptCode);
            } else {
                queryWrapper.and(TBizZone::getPCode).eq(pid);
                queryWrapper.eq("dept_code", userDeptCode);
            }
        } else {
            // 管理员权限：仅根据 pid 展开
            queryWrapper.and(TBizZone::getPCode).eq(pid);
        }

        List<TBizZone> list = service.list(queryWrapper);
        List<Map<String, Object>> result = new ArrayList<>();
        
        if (list != null && !list.isEmpty()) {
            for (TBizZone entity : list) {
             Map<String, Object> attr = new HashMap<>();
                // jsTree 所需的核心属性
                attr.put("id", entity.getCode());
                attr.put("text", entity.getName());
                
                // 自定义扩展数据绑定到 data 中
              Map<String, Object> data = new HashMap<>();
                data.put("p_id", entity.getPCode());
                
                attr.put("dept_code", entity.getDeptCode());
                attr.put("data", data);
                // 为了让前端树能显示展开小箭头以实现异步加载，默认设为 true
                attr.put("children", true);
                
                result.add(attr);
            }
        }
        
        return result;
    }
}
