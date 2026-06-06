package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TProjMoney
import com.tzdig.framework.mybatis.mapper.zsxt.TProjMoneyMapper
import org.springframework.stereotype.Service

@Service
class ITProjMoney : IService<TProjMoney>,
    ServiceImpl<TProjMoneyMapper, TProjMoney>() {
    
    fun batchSave(projMoneyList: List<TProjMoney>): Boolean {
        return saveBatch(projMoneyList)
    }
}
