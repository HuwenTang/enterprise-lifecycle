package com.tzdig.framework.service.impl

import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestmentXConstructionApproval
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestmentXOnlineApproval
import com.tzdig.framework.service.InvestOnlineService
import org.springframework.stereotype.Service

@Service
class InvestOnlineServiceImpl : InvestOnlineService {
    override fun getOnlineApprovalByInvestmentOnlineId(investmentOnlineId: String): List<String> {
        val investmentList = filter<ProjectDigitalInvestmentAttracting> {
            ProjectDigitalInvestmentAttracting::investOnlineId eq investmentOnlineId
        }
        if (investmentList.isEmpty()) {
            return emptyList()
        }
        val list = filter<ProjectInvestmentXOnlineApproval> {
            ProjectInvestmentXOnlineApproval::investmentId inList investmentList.map { it.id!! }
        }
        return list.map { it.onlineApprovalId!! }
    }

    override fun getConstructionApprovalByInvestmentOnlineId(investmentOnlineId: String): List<String> {
        val investmentList = filter<ProjectDigitalInvestmentAttracting> {
            ProjectDigitalInvestmentAttracting::investOnlineId eq investmentOnlineId
        }
        if (investmentList.isEmpty()) {
            return emptyList()
        }
        val list = filter<ProjectInvestmentXConstructionApproval> {
            ProjectInvestmentXConstructionApproval::investmentId inList investmentList.map { it.id!! }
        }
        return list.map { it.constructionApprovalId!! }
    }
}
