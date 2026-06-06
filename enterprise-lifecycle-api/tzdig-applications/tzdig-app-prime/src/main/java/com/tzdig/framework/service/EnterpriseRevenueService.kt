package com.tzdig.framework.service

interface EnterpriseRevenueService {
    fun getTotalRevenue(year: Int, quarter: Int, usccList: Collection<String>): Float
}
