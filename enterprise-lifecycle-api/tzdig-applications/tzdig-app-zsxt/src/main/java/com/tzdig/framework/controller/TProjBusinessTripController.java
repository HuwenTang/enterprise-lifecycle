package com.tzdig.framework.controller;

import cn.hutool.core.collection.CollectionUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.file.model.vo.FileDownloadVO;
import com.tzdig.framework.file.util.TempFileUtilKt;
import com.tzdig.framework.model.vo.TProjBusinessTripVO;
import com.tzdig.framework.mybatis.entity.zsxt.TProjBusinessTrip;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjBusinessTrip;
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
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

/**
 * 因公出访招商项目情况模块控制器
 */
@Tag(name = "因公出访招商项目情况模块")
@RestController
@RequestMapping("tProjBusinessTrip")
public class TProjBusinessTripController {

    @Resource
    private ITProjBusinessTrip service;

    @Resource
    private TProjProjectSignedMapper signedMapper;

    /**
     * 分页查询因公出访记录列表
     *
     * @param pageable 分页参数
     * @param entity   查询条件
     * @return 分页结果
     */

    @Operation(summary = "列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TProjBusinessTrip> list(Pageable pageable, @RequestBody TProjBusinessTrip entity) {
        QueryWrapper queryWrapper = buildQueryWrapper(entity);
        Page<TProjBusinessTrip> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjBusinessTrip> resultPage = service.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    /**
     * 导出因公出访记录 Excel
     *
     * @param entity 查询条件
     * @return 下载对象
     */

    @Operation(summary = "导出")
    @PostMapping("/export")
    public FileDownloadVO export(@RequestBody TProjBusinessTrip entity) {
        QueryWrapper queryWrapper = buildQueryWrapper(entity);
        List<TProjBusinessTrip> list = service.list(queryWrapper);

        File file = new ExcelWriteUtils<>(TProjBusinessTripVO.class)
                .writeWith(TempFileUtilKt.createNewTempFile("xlsx"), null, () -> {
                    AtomicInteger index = new AtomicInteger(1);
                    return Flux.fromIterable(list).map(record -> {
                        TProjBusinessTripVO vo = new TProjBusinessTripVO();
                        BeanUtils.copyProperties(record, vo);
                        return vo;
                    });
                });

        return FileDownloadVO.Companion.downloadVO(file, "因公出访招商项目情况导出.xlsx");
    }

    /**
     * 构建查询条件包装器
     */
    private QueryWrapper buildQueryWrapper(TProjBusinessTrip entity) {
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
        if (entity != null) {
            // 市区模糊查询 (对应 entity.name 字段)
            if (!ObjectUtils.isEmpty(entity.getName())) {
                queryWrapper.where(TProjBusinessTrip::getName).like(entity.getName());
            }
            // 市区代码精确查询
            if (!ObjectUtils.isEmpty(entity.getCode())) {
                queryWrapper.and(TProjBusinessTrip::getCode).eq(entity.getCode());
            }
            // 市区代码精确查询
            if (!ObjectUtils.isEmpty(entity.getTownCode())) {
                queryWrapper.and(TProjBusinessTrip::getTownCode).eq(entity.getTownCode());
            }
            // 市区代码精确查询
            if (!ObjectUtils.isEmpty(entity.getTownName())) {
                queryWrapper.and(TProjBusinessTrip::getTownName).eq(entity.getTownName());
            }
            // 市区代码精确查询
            if (!ObjectUtils.isEmpty(entity.getZoneCode())) {
                queryWrapper.and(TProjBusinessTrip::getZoneCode).eq(entity.getZoneCode());
            }
            // 市区代码精确查询
            if (!ObjectUtils.isEmpty(entity.getZoneName())) {
                queryWrapper.and(TProjBusinessTrip::getZoneName).eq(entity.getZoneName());
            }
            // 年份筛选
            if (!ObjectUtils.isEmpty(entity.getYear())) {
                queryWrapper.and(TProjBusinessTrip::getYear).eq(entity.getYear());
            }
            // 团组名称模糊查询
            if (!ObjectUtils.isEmpty(entity.getGroupName())) {
                queryWrapper.and(TProjBusinessTrip::getGroupName).like(entity.getGroupName());
            }
        }
        queryWrapper.orderBy(TProjBusinessTrip::getCreateTime).desc();
        return queryWrapper;
    }

    /**
     * 新增因公出访记录
     *
     * @param entity 因公出访实体
     */

    @Operation(summary = "新增")
    @PostMapping("/create")
    public Boolean create(@RequestBody TProjBusinessTrip entity) {
        return service.save(entity);
    }

    /**
     * 修改因公出访记录
     *
     * @param entity 因公出访实体
     */

    @Operation(summary = "修改")
    @PostMapping("/update")
    public Boolean update(@RequestBody TProjBusinessTrip entity) {
        if (ObjectUtils.isEmpty(entity.getId())) {
            throw new ApiException("id参数不能为空", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return service.updateById(entity);
    }

    /**
     * 删除因公出访记录
     *
     * @param id 主键 ID
     */

    @Operation(summary = "删除")
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }

    /**
     * 根据 ID 获取因公出访详情
     *
     * @param id 主键 ID
     * @return 活动详情
     */

    @Operation(summary = "详情")
    @GetMapping("/getById/{id}")
    public TProjBusinessTrip getById(@PathVariable("id") String id) {
        return service.getById(id);
    }
}
