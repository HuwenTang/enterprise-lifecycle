@file:Suppress("unused")

package com.tzdig.framework.mybatis.mapper.zsxt

import com.mybatisflex.core.paginate.Page
import com.tzdig.framework.mybatis.base.BaseMapper
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvest
import org.apache.ibatis.annotations.Param

interface TBizInvestMapper : BaseMapper<TBizInvest> {
    fun selectPageWithZone(
        @Param("pageSize") pageSize: Long,
        @Param("offset") offset: Long,
        @Param("companyName") companyName: String?,
        @Param("zoneCode") zoneCode: String?,
        @Param("industryCode") industryCode: String?,
        @Param("status") status: Int?
    ): List<TBizInvest>

    fun countWithZone(
        @Param("companyName") companyName: String?,
        @Param("zoneCode") zoneCode: String?,
        @Param("industryCode") industryCode: String?,
        @Param("status") status: Int?
    ): Long

    fun countNotFeedback(@Param("deptCode") deptCode: String): Long

}
