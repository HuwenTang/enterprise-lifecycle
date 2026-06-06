package com.tzdig.framework.service

import com.mybatisflex.kotlin.scope.QueryScope
import com.tzdig.framework.model.vo.fagai.KeyProjectsItem
import com.tzdig.framework.mybatis.bo.ProjectDigitalInvestmentAttractingParam
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import java.time.LocalDate

interface InvestmentAttractingService {
    fun apply(
        queryScope: QueryScope,
        param: ProjectDigitalInvestmentAttractingParam,
        grantedAreas: Set<String>,
        deptList: List<String>?,
        cobList: Set<String>,
    )

    fun getParkInfoOfInvestmentAttracting(investmentId: String): ProjectDigitalInvestmentAttracting?

    fun notStartProjects(
        startTime: LocalDate?,
        endTime: LocalDate?,
        minAmount: Double?,
        maxAmount: Double?,
        projectType: String?,
        isKcProj: Boolean?,
        step: String
    ): List<KeyProjectsItem>
}
