@file:Suppress("unused")

package com.tzdig.framework.mybatis.mapper.zsxt

import com.tzdig.framework.mybatis.base.BaseMapper
import com.tzdig.framework.mybatis.entity.zsxt.TProjPgyj

interface TProjPgyjMapper : BaseMapper<TProjPgyj> {

    fun saveAll(list: List<TProjPgyj>): Int {
        return insertBatch(list)
    }
}
