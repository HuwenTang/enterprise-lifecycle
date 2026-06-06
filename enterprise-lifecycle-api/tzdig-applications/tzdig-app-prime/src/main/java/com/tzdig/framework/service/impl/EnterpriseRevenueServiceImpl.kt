package com.tzdig.framework.service.impl

import com.mybatisflex.core.query.QueryMethods
import com.mybatisflex.kotlin.extensions.db.queryRow
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.mybatis.entity.prime.EnterpriseEconomicInfo
import com.tzdig.framework.service.EnterpriseRevenueService
import org.springframework.stereotype.Service

@Service
class EnterpriseRevenueServiceImpl : EnterpriseRevenueService {
    override fun getTotalRevenue(year: Int, quarter: Int, usccList: Collection<String>): Float {
        if (usccList.isEmpty()) return 0f
        return queryRow {
            select(
                QueryMethods
                    .sum("revenue_${year}_quarter_${quarter}")
                    .`as`("sum")
            )
            from(EnterpriseEconomicInfo::class.java)
            where(EnterpriseEconomicInfo::id inList usccList)
        }
            ?.getFloat("sum")
            ?: 0f
    }
}
