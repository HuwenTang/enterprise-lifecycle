package com.tzdig.framework.mybatis.service.zsxt

import com.mybatisflex.core.paginate.Page
import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvest
import com.tzdig.framework.mybatis.mapper.zsxt.TBizInvestMapper
import org.springframework.stereotype.Service

@Service
class ITBizInvest : IService<TBizInvest>,
    ServiceImpl<TBizInvestMapper, TBizInvest>() {

    fun pageWithZone(page: Page<TBizInvest>, companyName: String?, zoneCode: String?, industryCode: String?, status: Int?): Page<TBizInvest> {
        val total = mapper.countWithZone(companyName, zoneCode, industryCode, status)
        page.totalRow = total
        val offset = (page.pageNumber - 1) * page.pageSize
        val list = mapper.selectPageWithZone(page.pageSize, offset, companyName, zoneCode, industryCode, status)
        page.records = list
        return page
    }

    fun countNotFeedback(deptCode: String): Long = mapper.countNotFeedback(deptCode)
}
