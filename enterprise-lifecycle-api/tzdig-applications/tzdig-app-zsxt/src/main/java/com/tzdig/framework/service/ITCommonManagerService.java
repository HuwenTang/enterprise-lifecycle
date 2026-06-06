package com.tzdig.framework.service;

import com.tzdig.framework.mybatis.entity.zsxt.TCommonManager;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableResult;

/**
 * 通用管理员业务逻辑接口
 */
public interface ITCommonManagerService {

    /**
     * 分页查询管理员列表
     *
     * @param pageable 分页参数
     * @param entity   过滤条件
     * @return 分页结果
     */
    PageableResult<TCommonManager> list(Pageable pageable, TCommonManager entity);

}
