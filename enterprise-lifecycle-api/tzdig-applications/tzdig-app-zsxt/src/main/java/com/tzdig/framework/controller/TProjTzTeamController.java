package com.tzdig.framework.controller;

import cn.hutool.core.collection.CollectionUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TProjTzTeam;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjTzTeam;
import com.tzdig.framework.security.annotation.SaCheckRoot;
import com.tzdig.framework.web.exception.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

/**
 * 招商团队名录模块控制器
 */
@Tag(name = "招商团队名录模块")
@RestController
@RequestMapping("tProjTzTeam")
public class TProjTzTeamController {

    @Resource
    private ITProjTzTeam service;

    @Resource
    private TProjProjectSignedMapper signedMapper;

    /**
     * 分页查询招商团队列表
     *
     * @param pageable 分页参数
     * @param entity   查询条件
     * @return 分页结果
     */
    
    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjTzTeam> list(Pageable pageable, @RequestBody TProjTzTeam entity) {
        QueryWrapper queryWrapper = buildQueryWrapper(entity);
        Page<TProjTzTeam> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjTzTeam> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 构建查询条件包装器
     */
    private QueryWrapper buildQueryWrapper(TProjTzTeam entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
            String id = getUserAccount().getId();
            List<String> zoneCodes = signedMapper.getZoneCodesByUserId(id);
            List<String> townCodes = signedMapper.getTownCodesByUserId(id);

            if (CollectionUtil.isNotEmpty(zoneCodes)) {
                queryWrapper.in("zone_code", zoneCodes);
            }
            if (CollectionUtil.isEmpty(zoneCodes)) {
                queryWrapper.in("town_code", townCodes);
            }
            // 姓名模糊查询
            if (!ObjectUtils.isEmpty(entity.getName())) {
                queryWrapper.where(TProjTzTeam::getName).like(entity.getName());
            }
            if (!ObjectUtils.isEmpty(entity.getDistrictCode())) {
                queryWrapper.and(TProjTzTeam::getDistrictCode).likeRight(entity.getDistrictCode());
            }
            if (!ObjectUtils.isEmpty(entity.getZoneCode())) {
                queryWrapper.and(TProjTzTeam::getZoneCode).likeRight(entity.getZoneCode());
            }
            if (!ObjectUtils.isEmpty(entity.getTownCode())) {
                queryWrapper.and(TProjTzTeam::getTownCode).likeRight(entity.getTownCode());
            }
            if (!ObjectUtils.isEmpty(entity.getPhone())) {
                queryWrapper.and(TProjTzTeam::getPhone).eq(entity.getPhone());
            }
            if (!ObjectUtils.isEmpty(entity.getPosition())) {
                queryWrapper.and(TProjTzTeam::getPosition).like(entity.getPosition());
            }
            if (!ObjectUtils.isEmpty(entity.getSpecialization())) {
                queryWrapper.and(TProjTzTeam::getSpecialization).like(entity.getSpecialization());
            }
        queryWrapper.orderBy(TProjTzTeam::getCreateTime).desc();
        return queryWrapper;
    }

    /**
     * 新增招商团队成员
     *
     * @param entity 成员实体
     */
    
    @Operation(summary = "新增")
    @PostMapping("/create")
    public Boolean create(@RequestBody TProjTzTeam entity) {
       return service.save(entity);
    }

    /**
     * 修改招商团队成员
     * @param entity 成员实体
     */
    
    @Operation(summary = "修改")
    @PostMapping("/update")
    public Boolean update(@RequestBody TProjTzTeam entity) {
      if(ObjectUtils.isEmpty(entity.getId())){
          throw new ApiException("id参数不能为空", HttpStatus.INTERNAL_SERVER_ERROR);
      }
       return service.updateById(entity);
    }

    /**
     * 删除招商团队成员
     *
     * @param id 主键 ID
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }

    /**
     * 根据 ID 获取成员详情
     *
     * @param id 主键 ID
     * @return 详情
     */
    
    @Operation(summary = "详情")
    @GetMapping("/getById/{id}")
    public TProjTzTeam getById(@PathVariable("id") String id) {
        return service.getById(id);
    }
}
