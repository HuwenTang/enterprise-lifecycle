package com.tzdig.framework.service;

import com.tzdig.framework.model.dto.BizInvestDemandDTO;

/**
 * 招商需求留言板 Service接口
 */
public interface IBizInvestDemandService {

    /**
     * 新增需求
     */
    boolean create(BizInvestDemandDTO dto);

    /**
     * 修改需求
     */
    boolean update(BizInvestDemandDTO dto);

    /**
     * 审核
     */
    boolean audit(BizInvestDemandDTO dto);

    /**
     * 答复
     */
    boolean reply(BizInvestDemandDTO dto);

    /**
     * 获取详情
     */
    BizInvestDemandDTO getById(Long id);

    /**
     * 删除
     */
    boolean delete(Long id);
}