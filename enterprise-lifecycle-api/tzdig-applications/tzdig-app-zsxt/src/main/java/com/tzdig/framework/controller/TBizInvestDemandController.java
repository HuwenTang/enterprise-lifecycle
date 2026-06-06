package com.tzdig.framework.controller;

import cn.hutool.core.collection.CollectionUtil;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.model.dto.BizInvestDemandDTO;
import com.tzdig.framework.model.vo.TBizInvestDemandVO;
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvestDemand;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITBizInvestDemand;
import com.tzdig.framework.util.UserInfoUtil;
import com.tzdig.framework.web.exception.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

/**
 * 招商需求留言板 Controller
 */
@Tag(name = "招商需求留言板")
@RestController
@RequestMapping("tBizInvestDemand")
public class TBizInvestDemandController {

    @Resource
    private ITBizInvestDemand service;

    @Resource
    private TProjProjectSignedMapper signedMapper;

    /**
     * 园区角色-列表查询
     */
    @Operation(summary = "园区-列表")
    @PostMapping("/list")
    @PageableQuery
    public PageableResult<TBizInvestDemand> zoneList(Pageable pageable, @RequestBody BizInvestDemandDTO query) {
        if (query == null) {
            query = new BizInvestDemandDTO();
        }
        QueryWrapper queryWrapper = buildZoneQueryWrapper(query);
        Page<TBizInvestDemand> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TBizInvestDemand> resultPage = service.page(page, queryWrapper);
        return PageableResult.of(resultPage);
    }

    /**
     * 园区-新增
     */
    @Operation(summary = "园区-新增")
    @PostMapping("/create")
    public boolean zoneCreate(@RequestBody BizInvestDemandDTO dto) {
        TBizInvestDemand entity = new TBizInvestDemand();
        BeanUtils.copyProperties(dto, entity);
        entity.setStatus(0);
        entity.setCreatorId(getUserAccount().getId());
        return service.save(entity);
    }

    /**
     * 园区-修改
     */
    @Operation(summary = "园区-修改")
    @PostMapping("/update")
    public boolean zoneUpdate(@RequestBody BizInvestDemandDTO dto) {
        if (ObjectUtils.isEmpty(dto.getId())) {
            throw new ApiException("id不能为空", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        TBizInvestDemand existing = service.getById(dto.getId().toString());
        if (existing == null) {
            throw new ApiException("记录不存在", HttpStatus.NOT_FOUND);
        }
        if (existing.getStatus() != 0) {
            throw new ApiException("已审核的需求无法修改", HttpStatus.BAD_REQUEST);
        }
        TBizInvestDemand entity = new TBizInvestDemand();
        BeanUtils.copyProperties(dto, entity);
        entity.setId(dto.getId().toString());
        return service.updateById(entity);
    }

    /**
     * 市商务局-审核
     */
    @Operation(summary = "商务局-审核")
    @PostMapping("/commerce/audit")
    public boolean commerceAudit(@RequestBody BizInvestDemandDTO dto) {
        if (ObjectUtils.isEmpty(dto.getId())) {
            throw new ApiException("id不能为空", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        TBizInvestDemand existing = service.getById(dto.getId().toString());
        if (existing == null) {
            throw new ApiException("记录不存在", HttpStatus.NOT_FOUND);
        }
        if (existing.getStatus() != 0) {
            throw new ApiException("只能审核待审核状态的需求", HttpStatus.BAD_REQUEST);
        }
        TBizInvestDemand entity = new TBizInvestDemand();
        entity.setId(dto.getId().toString());
        entity.setStatus(1);
        entity.setAuditId(getUserAccount().getId());
        entity.setAuditTime(LocalDateTime.now());
        entity.setAuditRemark(dto.getAuditRemark());
        return service.updateById(entity);
    }

    /**
     * 驻外机构-答复
     */
    @Operation(summary = "驻外机构-答复")
    @PostMapping("/zjb/reply")
    public boolean zjbReply(@RequestBody BizInvestDemandDTO dto) {
        if (ObjectUtils.isEmpty(dto.getId())) {
            throw new ApiException("id不能为空", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        TBizInvestDemand existing = service.getById(dto.getId().toString());
        if (existing == null) {
            throw new ApiException("记录不存在", HttpStatus.NOT_FOUND);
        }
        if (existing.getStatus() != 1) {
            throw new ApiException("只能答复已审核的需求", HttpStatus.BAD_REQUEST);
        }
        TBizInvestDemand entity = new TBizInvestDemand();
        entity.setId(dto.getId().toString());
        entity.setStatus(2);
        entity.setReplyId(getUserAccount().getId());
        entity.setReplyTime(LocalDateTime.now());
        entity.setReplyContent(dto.getReplyContent());
        return service.updateById(entity);
    }

    /**
     * 详情
     */
    @Operation(summary = "详情")
    @GetMapping("/getInfo/{id}")
    public TBizInvestDemandVO getInfo(@PathVariable("id") String id) {

        TBizInvestDemand entity = service.getById(id);
        return new TBizInvestDemandVO(entity);
    }

    /**
     * 删除
     */
    @Operation(summary = "删除")
    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable("id") String id) {
        TBizInvestDemand existing = service.getById(id);
        if (existing == null) {
            throw new ApiException("记录不存在", HttpStatus.NOT_FOUND);
        }
        if (existing.getStatus() == 1) {
            throw new ApiException("已审核的需求无法删除", HttpStatus.BAD_REQUEST);
        }
        return service.removeById(id);
    }

    /**
     * 构建园区角色查询条件
     */
    private QueryWrapper buildZoneQueryWrapper(BizInvestDemandDTO query) {
        QueryWrapper queryWrapper = new QueryWrapper();

        String userId = getUserAccount().getId();
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(userId);
        List<String> townCodes = signedMapper.getTownCodesByUserId(userId);
        // 园区角色按zone_code过滤
        if (CollectionUtil.isNotEmpty(zoneCodes)) {
            queryWrapper.in("zone_code", zoneCodes);
        }
        // 判断是否镇街人员
        if  (CollectionUtil.isEmpty(zoneCodes)) {
            queryWrapper.in("town_code", townCodes);
        }
        // 如果当前人员是战区人员
        String zjbCode = UserInfoUtil.getOrgCode();
        if (!ObjectUtils.isEmpty(zjbCode)) {
            queryWrapper.eq("place", zjbCode);
        }
        // 标题模糊查询
        if (!ObjectUtils.isEmpty(query.getTitle())) {
            queryWrapper.where(TBizInvestDemand::getTitle).like(query.getTitle());
        }
        // 状态查询
        if (!ObjectUtils.isEmpty(query.getDistrictCode())) {
            queryWrapper.and(TBizInvestDemand::getDistrictCode).eq(query.getDistrictCode());
        }
        // 状态查询
        if (!ObjectUtils.isEmpty(query.getZoneCode())) {
            queryWrapper.and(TBizInvestDemand::getZoneCode).eq(query.getZoneCode());
        }
        // 状态查询
        if (!ObjectUtils.isEmpty(query.getTownCode())) {
            queryWrapper.and(TBizInvestDemand::getTownCode).eq(query.getTownCode());
        }
        // 状态查询
        if (!ObjectUtils.isEmpty(query.getStatus())) {
            queryWrapper.and(TBizInvestDemand::getStatus).eq(query.getStatus());
        }
        // 状态查询
        if (!ObjectUtils.isEmpty(query.getContent())) {
            queryWrapper.and(TBizInvestDemand::getContent).like(query.getContent());
        }
        // 状态查询
        if (!ObjectUtils.isEmpty(query.getLinkerName())) {
            queryWrapper.and(TBizInvestDemand::getLinkerName).like(query.getLinkerName());
        }
        // 状态查询
        if (!ObjectUtils.isEmpty(query.getLinkerTel())) {
            queryWrapper.and(TBizInvestDemand::getLinkerTel).like(query.getLinkerTel());
        }
        // 状态查询
        if (!ObjectUtils.isEmpty(query.getStartTime())) {
            queryWrapper.and(TBizInvestDemand::getExpectTime).ge(query.getStartTime());
        }
        // 状态查询
        if (!ObjectUtils.isEmpty(query.getEndTime())) {
            queryWrapper.and(TBizInvestDemand::getExpectTime).le(query.getEndTime());
        }
        queryWrapper.orderBy(TBizInvestDemand::getCreateTime).desc();
        return queryWrapper;
    }
}