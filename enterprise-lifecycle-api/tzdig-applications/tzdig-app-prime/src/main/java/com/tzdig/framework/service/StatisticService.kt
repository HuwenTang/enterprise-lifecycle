package com.tzdig.framework.service

import com.tzdig.framework.model.vo.LHBProjectInfoVO
import com.tzdig.framework.model.vo.StatisticLHBVO
import com.tzdig.framework.model.vo.StatisticLHBVO.ProjectCountInfo
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting.ProjectProgress
import java.time.LocalDateTime

interface StatisticService {
    fun projectInfo(
        endDate: LocalDateTime,
        progress: ProjectProgress,
        rmb1: Double?,
        rmb2: Double?,
        code: String?
    ): ProjectCountInfo

    fun projectNoninvest(
        year: Int,
        rmb1: Double?,
        rmb2: Double?,
        month: Int,
        code: String?,
        isZZKC: Boolean?,
        progress: ProjectProgress?
    ): ProjectCountInfo

    fun LHBData(
        endDate: LocalDateTime
    ): List<StatisticLHBVO>

    fun LHBProjectInfo(
        endDate: LocalDateTime,
        code: String,
        column: Int,
    ): List<LHBProjectInfoVO>

    fun projectInfoTotal(
        endDate: LocalDateTime,
        progress: ProjectProgress,
        rmb1: Double?,
        rmb2: Double?,
        code: String?,
        isNDTZ: Boolean?,
    ): List<ProjectDigitalInvestmentAttracting>


    fun projectInfoMonth(
        endDate: LocalDateTime,
        progress: ProjectProgress,
        rmb1: Double?,
        rmb2: Double?,
        code: String?,
        isNDTZ: Boolean?,
    ): List<ProjectDigitalInvestmentAttracting>
}
