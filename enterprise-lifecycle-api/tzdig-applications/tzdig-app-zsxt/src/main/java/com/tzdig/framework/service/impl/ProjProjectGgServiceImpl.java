package com.tzdig.framework.service.impl;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjectUtil;
import com.alibaba.fastjson2.JSON;
import com.tzdig.framework.mybatis.entity.zsxt.TProjectSignedGg;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjectSignedGgMapper;
import com.tzdig.framework.mybatis.vo.TProjectSignedGgVo;
import com.tzdig.framework.mybatis.vo.TProjectSignedOnlineVo;
import com.tzdig.framework.service.IProjProjectGgService;
import com.tzdig.framework.web.rpc.OpenapiFeignClient;
import jakarta.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 绑定工改 Service 实现类
 */
@Service
public class ProjProjectGgServiceImpl implements IProjProjectGgService {

    @Resource
    private OpenapiFeignClient openapiFeignClient;

    @Resource
    private TProjectSignedGgMapper ggMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void save(TProjectSignedGg entity) {
        //异常绑定
        if (ObjectUtil.isEmpty(entity.getConstructionApprovalId())) {
            entity.setStatus("2");
            TProjectSignedGgVo vo = new TProjectSignedGgVo();
            BeanUtils.copyProperties(entity, vo);
            vo.setApplicationTime(DateUtil.toLocalDateTime(DateUtil.parse(entity.getApplicationTime())));
            openapiFeignClient.createOrUpdateProjectConstructionApproval(JSON.toJSONString(vo));
            openapiFeignClient.addProjectGgApprovalBind(entity.getProjectCode(), entity.getSignedId());
            entity.setConstructionApprovalId(entity.getProjectCode());
        } else {
            entity.setStatus("1");
            openapiFeignClient.addProjectGgApprovalBind(entity.getConstructionApprovalId(), entity.getSignedId());
        }
        entity.setId(null);
        ggMapper.insert(entity);
    }

    @Override
    public void removeById(String id) {
        TProjectSignedGg gg = ggMapper.selectOneById(id);
        openapiFeignClient.removeProjectGgApprovalBind(gg.getConstructionApprovalId(), gg.getSignedId());
        ggMapper.deleteById(id);
    }
}
