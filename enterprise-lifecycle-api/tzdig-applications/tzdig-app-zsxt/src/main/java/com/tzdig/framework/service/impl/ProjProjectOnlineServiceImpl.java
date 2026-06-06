package com.tzdig.framework.service.impl;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjectUtil;
import com.alibaba.fastjson2.JSON;
import com.tzdig.framework.mybatis.entity.zsxt.TProjectSignedOnline;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjectSignedOnlineMapper;
import com.tzdig.framework.mybatis.vo.TProjectSignedOnlineVo;
import com.tzdig.framework.service.IProjProjectOnlineService;
import com.tzdig.framework.web.exception.NotFoundException;
import com.tzdig.framework.web.rpc.OpenapiFeignClient;
import jakarta.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 绑定工改 Service 实现类
 */
@Service
public class ProjProjectOnlineServiceImpl implements IProjProjectOnlineService {

    @Resource
    private OpenapiFeignClient openapiFeignClient;

    @Resource
    private TProjectSignedOnlineMapper onlineMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void save(TProjectSignedOnline entity) {
        if (ObjectUtil.isEmpty(entity.getOnlineApprovalId())) {
            entity.setStatus("2");
            TProjectSignedOnlineVo vo = new TProjectSignedOnlineVo();
            BeanUtils.copyProperties(entity, vo);
            vo.setApplicationTime(DateUtil.toLocalDateTime(DateUtil.parse(entity.getApplicationTime())));
            // 创建项目
            openapiFeignClient.createOrUpdateProjectOnlineApproval(JSON.toJSONString(vo));
            // 绑定项目
            openapiFeignClient.addSignedProjectOnlineApprovalBind(entity.getProjectCode(), entity.getSignedId());
            entity.setOnlineApprovalId(entity.getProjectCode());
        } else {
            entity.setStatus("1");
            openapiFeignClient.addSignedProjectOnlineApprovalBind(entity.getOnlineApprovalId(), entity.getSignedId());
        }
        entity.setId(null);
        onlineMapper.insert(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeById(String id) {
        TProjectSignedOnline gg = onlineMapper.selectOneById(id);
        if (ObjectUtil.isEmpty(gg)) {
            throw new NotFoundException("绑定项目不存在！");
        }
        openapiFeignClient.removeSignedProjectOnlineApprovalBind(gg.getOnlineApprovalId(), gg.getSignedId());
        onlineMapper.deleteById(id);
    }
}
