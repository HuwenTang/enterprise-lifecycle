package com.tzdig.framework.service

interface InvestOnlineService {
    fun getOnlineApprovalByInvestmentOnlineId(investmentOnlineId: String): List<String>
    fun getConstructionApprovalByInvestmentOnlineId(investmentOnlineId: String): List<String>
}
