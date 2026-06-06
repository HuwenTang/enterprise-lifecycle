package com.tzdig.framework.controller;

import cn.hutool.core.collection.CollectionUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.file.model.vo.FileDownloadVO;
import com.tzdig.framework.file.util.TempFileUtilKt;
import com.tzdig.framework.model.vo.TActivitiesVO;
import com.tzdig.framework.model.vo.TProjInvestActivitiesEntityVO;
import com.tzdig.framework.model.vo.TProjInvestActivitiesVO;
import com.tzdig.framework.mybatis.entity.zsxt.TProjInvestActivities;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjInvestActivities;
import com.tzdig.framework.mybatis.vo.TManagerVO;
import com.tzdig.framework.util.UserInfoUtil;
import com.tzdig.framework.web.exception.ApiException;
import com.tzdig.framework.web.util.ExcelWriteUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.io.File;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

/**
 * 市（区）活动记录模块控制器
 */
@Tag(name = "活动记录模块")
@RestController
@RequestMapping("tProjInvestActivities")
public class TProjInvestActivitiesController {

    @Resource
    private ITProjInvestActivities service;

    @Resource
    private TProjProjectSignedMapper signedMapper;

    /**
     * 分页查询活动记录列表
     *
     * @param pageable 分页参数
     * @param entity   查询条件 DTO
     * @return 分页结果
     */

    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjInvestActivities> list(Pageable pageable, @RequestBody TProjInvestActivities entity) {
        QueryWrapper queryWrapper = buildQueryWrapper(entity);
        Page<TProjInvestActivities> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjInvestActivities> resultPage = service.page(page, queryWrapper);
        return PageableResult.of(resultPage);
    }

    /**
     * 分页查询待审核活动记录列表 (auditStatus = 0)
     *
     * @param pageable 分页参数
     * @param entity   查询条件
     * @return 分页结果
     */

    @Operation(summary = "待审核列表")
    @PostMapping("/auditList")
    @PageableQuery
    public PageableResult<TProjInvestActivities> auditList(Pageable pageable, @RequestBody TProjInvestActivities entity) {

        entity.setAuditStatus(0); // 强制查询待审核状态
        QueryWrapper queryWrapper = buildQueryWrapper(entity);
        Page<TProjInvestActivities> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjInvestActivities> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 导出活动记录 Excel
     *
     * @param entity 查询条件 DTO
     * @return 下载对象
     */

    @Operation(summary = "导出")
    @PostMapping("/export")
    public FileDownloadVO export(@RequestBody TProjInvestActivities entity) {
        QueryWrapper queryWrapper = buildQueryWrapper(entity);
        List<TProjInvestActivities> list = service.list(queryWrapper);
        File file = new ExcelWriteUtils<>(TProjInvestActivitiesVO.class).writeWith(TempFileUtilKt.createNewTempFile("xlsx"), null, () -> {
            AtomicInteger index = new AtomicInteger(1);
            return Flux.fromIterable(list).map(record -> {
                TProjInvestActivitiesVO vo = new TProjInvestActivitiesVO();
                BeanUtils.copyProperties(record, vo);
                return vo;
            });
        });

        return FileDownloadVO.Companion.downloadVO(file, "活动记录导出.xlsx");
    }

    /**
     * 构建查询条件包装器
     */
    private QueryWrapper buildQueryWrapper(TProjInvestActivities entity) {
        QueryWrapper queryWrapper = new QueryWrapper();
        String id = getUserAccount().getId();
        String zjbCode = UserInfoUtil.getOrgCode();
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(id);
        List<String> townCodes = signedMapper.getTownCodesByUserId(id);

        if (CollectionUtil.isNotEmpty(zoneCodes)) {
            queryWrapper.in("zone_code", zoneCodes);
        }
        if (CollectionUtil.isEmpty(zoneCodes)) {
            queryWrapper.in("town_code", townCodes);
        }
        if (ObjectUtils.isNotEmpty(zjbCode)) {
            queryWrapper.eq("zjb_code", zjbCode);
        }
        if (!ObjectUtils.isEmpty(entity.getZoneCode())) {
            queryWrapper.and(TProjInvestActivities::getZoneCode).likeRight(entity.getZoneCode());
        }
        // 园区名称精确查询 (User used getZoneName())
        if (!ObjectUtils.isEmpty(entity.getZoneName())) {
            queryWrapper.and(TProjInvestActivities::getZoneName).eq(entity.getZoneName());
        }
        // 园区名称精确查询 (User used getZoneName())
        if (!ObjectUtils.isEmpty(entity.getTownName())) {
            queryWrapper.and(TProjInvestActivities::getTownName).eq(entity.getTownName());
        }
        // 园区名称精确查询 (User used getZoneName())
        if (!ObjectUtils.isEmpty(entity.getTownCode())) {
            queryWrapper.and(TProjInvestActivities::getTownCode).eq(entity.getTownCode());
        }
        // 市区模糊查询 (对应 entity.name 字段)
        if (!ObjectUtils.isEmpty(entity.getName())) {
            queryWrapper.where(TProjInvestActivities::getName).like(entity.getName());
        }
        // 市区代码精确查询
        if (!ObjectUtils.isEmpty(entity.getCode())) {
            queryWrapper.and(TProjInvestActivities::getCode).likeRight(entity.getCode());
        }
        // 驻京办查询
        if (!ObjectUtils.isEmpty(entity.getZjbAddress())) {
            queryWrapper.and(TProjInvestActivities::getZjbAddress).like(entity.getZjbAddress());
        }

        // 日期范围筛选
        if (!ObjectUtils.isEmpty(entity.getStartTime())) {
            queryWrapper.and(TProjInvestActivities::getStartTime).ge(entity.getStartTime());
        }
        if (!ObjectUtils.isEmpty(entity.getEndTime())) {
            queryWrapper.and(TProjInvestActivities::getEndTime).le(entity.getEndTime());
        }
        // 审核状态筛选
        if (!ObjectUtils.isEmpty(entity.getAuditStatus())) {
            queryWrapper.and(TProjInvestActivities::getAuditStatus).eq(entity.getAuditStatus());
        }
        // 查询对应驻京办角色
        if (!ObjectUtils.isEmpty(entity.getZjbCode())) {
            queryWrapper.and(TProjInvestActivities::getZjbCode).eq(entity.getZjbCode());
        }
        queryWrapper.orderBy(TProjInvestActivities::getCreateTime).desc();
        return queryWrapper;
    }


    /**
     * 新增活动记录
     *
     * @param entity 活动实体
     */

    @Operation(summary = "新增")
    @PostMapping
    public Boolean create(@RequestBody TProjInvestActivities entity) {
        return service.save(entity);
    }

    /**
     * 修改活动记录
     *
     * @param entity 活动实体
     */

    @Operation(summary = "修改")
    @PostMapping("/update")
    public Boolean update(@RequestBody TProjInvestActivities entity) {
        if (ObjectUtils.isEmpty(entity.getId())) {
            throw new ApiException("id参数不能为空", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        entity.setAuditStatus(0);
        return service.updateById(entity);
    }

    /**
     * 审核活动记录
     *
     * @param entity 审核信息（需包含 ID, auditStatus, auditRemark）
     */

    @Operation(summary = "审核")
    @PostMapping("/audit")
    public Boolean audit(@RequestBody TProjInvestActivities entity) {
        if (ObjectUtils.isEmpty(entity.getId())) {
            throw new ApiException("id参数不能为空", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        String id = getUserAccount().getId();
        entity.setAuditId(id);
        entity.setAuditTime(LocalDateTime.now());
        return service.updateById(entity);
    }

    /**
     * 删除活动记录
     *
     * @param id 主键 ID
     */

    @Operation(summary = "删除")
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }

    /**
     * 根据 ID 获取活动记录详情
     *
     * @param id 主键 ID
     * @return 活动详情
     */

    @Operation(summary = "详情")
    @GetMapping("/getById/{id}")
    public TProjInvestActivities getById(@PathVariable("id") String id) {
        TProjInvestActivities entity = service.getById(id);
        return new TProjInvestActivitiesEntityVO(entity);
    }


    /**
     * 查询驻京办对应权限
     *
     * @return 活动详情
     */

    @Operation(summary = "查询驻京办对应权限")
    @GetMapping("/listZjbRole")
    public List<TActivitiesVO> listZjbRole() {
        return Arrays.asList(new TActivitiesVO("驻深办", "dyundHPrj88dFez3eFMMXpfwAlKP"), new TActivitiesVO("驻沪办", "JWux2unB2nP3I5ab5IPb6qGjIL71"), new TActivitiesVO("驻京办", "pYulYfpgkRREtmkAmIaawVHKEMxg"), new TActivitiesVO("驻宁办", "rYuRCmwomzRFLxqLUDeDdEato3J"), new TActivitiesVO("其他地区", "0"));
    }
}
