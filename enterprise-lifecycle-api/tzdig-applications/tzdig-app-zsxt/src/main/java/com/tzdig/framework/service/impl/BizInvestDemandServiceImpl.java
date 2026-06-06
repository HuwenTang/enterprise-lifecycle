package com.tzdig.framework.service.impl;

import com.tzdig.framework.model.dto.BizInvestDemandDTO;
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvestDemand;
import com.tzdig.framework.mybatis.service.zsxt.ITBizInvestDemand;
import com.tzdig.framework.service.IBizInvestDemandService;
import jakarta.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 招商需求留言板 Service 实现类
 */
@Service
public class BizInvestDemandServiceImpl implements IBizInvestDemandService {

    @Resource
    private ITBizInvestDemand demandService;

    @Override
    @Transactional
    public boolean create(BizInvestDemandDTO dto) {
        TBizInvestDemand entity = toEntity(dto);
        entity.setStatus(0);
        return demandService.save(entity);
    }

    @Override
    @Transactional
    public boolean update(BizInvestDemandDTO dto) {
        TBizInvestDemand entity = toEntity(dto);
        entity.setId(dto.getId().toString());
        return demandService.updateById(entity);
    }

    @Override
    @Transactional
    public boolean audit(BizInvestDemandDTO dto) {
        TBizInvestDemand entity = new TBizInvestDemand();
        entity.setId(dto.getId().toString());
        entity.setStatus(dto.getStatus());
        entity.setAuditRemark(dto.getAuditRemark());
        return demandService.updateById(entity);
    }

    @Override
    @Transactional
    public boolean reply(BizInvestDemandDTO dto) {
        TBizInvestDemand entity = new TBizInvestDemand();
        entity.setId(dto.getId().toString());
        entity.setStatus(2);
        entity.setReplyContent(dto.getReplyContent());
        return demandService.updateById(entity);
    }

    @Override
    public BizInvestDemandDTO getById(Long id) {
        TBizInvestDemand entity = demandService.getById(id.toString());
        return toDTO(entity);
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return demandService.removeById(id.toString());
    }

    private TBizInvestDemand toEntity(BizInvestDemandDTO dto) {
        if (dto == null) return null;
        TBizInvestDemand entity = new TBizInvestDemand();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    private BizInvestDemandDTO toDTO(TBizInvestDemand entity) {
        if (entity == null) return null;
        BizInvestDemandDTO dto = new BizInvestDemandDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
}