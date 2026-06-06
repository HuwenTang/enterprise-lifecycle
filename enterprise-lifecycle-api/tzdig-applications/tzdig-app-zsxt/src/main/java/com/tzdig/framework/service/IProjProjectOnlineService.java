package com.tzdig.framework.service;

import com.tzdig.framework.mybatis.entity.zsxt.TProjectSignedOnline;

/**
 * 绑定工改
 */
public interface IProjProjectOnlineService {


    void save(TProjectSignedOnline entity);

    void removeById(String id);
}
