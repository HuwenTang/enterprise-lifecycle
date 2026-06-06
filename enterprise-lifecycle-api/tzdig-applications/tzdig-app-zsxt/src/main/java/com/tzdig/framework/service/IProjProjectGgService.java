package com.tzdig.framework.service;

import com.tzdig.framework.mybatis.entity.zsxt.TProjectSignedGg;
import org.springframework.stereotype.Service;

/**
 * 绑定工改
 */
public interface IProjProjectGgService {


    void save(TProjectSignedGg entity);

    void removeById(String id);
}
