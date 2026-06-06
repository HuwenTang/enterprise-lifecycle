package com.tzdig.framework.service;

import com.tzdig.framework.model.dto.TProjectDTO;
import com.tzdig.framework.mybatis.entity.zsxt.TProjProjectSigned;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * ZSXT 业务逻辑专用 Service
 * 处理涉及多表、跨实体的业务场景，如转签约、转共享等需要事务一致性的操作。
 */
public interface IProjectService {

    /**
     * 将意向项目流转至共享项目
     * @param dto 包含原项目 ID 及流转原因
     * @return 是否流转成功
     */
    @Transactional(rollbackFor = Exception.class)
    Boolean toShare(TProjectDTO dto);

    /**
     * 导出项目列表
     * @param tProjProject 过滤条件
     * @return 下载对象
     */
    com.tzdig.framework.file.model.vo.FileDownloadVO export(com.tzdig.framework.mybatis.entity.zsxt.TProjProject tProjProject);

    /**
     * 构建项目查询条件
     * @param tProjProject 过滤条件
     * @return QueryWrapper
     */
    com.mybatisflex.core.query.QueryWrapper buildQueryWrapper(com.tzdig.framework.mybatis.entity.zsxt.TProjProject tProjProject);
}
