package com.tzdig.framework.web.service

import com.tzdig.framework.mybatis.entity.system.SystemArea

interface AreaService {
    fun getById(id: String): SystemArea?
    fun getAllChildren(areas: Collection<SystemArea>): Set<SystemArea>
}
