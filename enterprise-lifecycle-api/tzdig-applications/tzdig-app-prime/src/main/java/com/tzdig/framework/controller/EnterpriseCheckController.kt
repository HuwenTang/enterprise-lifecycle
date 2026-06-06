package com.tzdig.framework.controller

import com.mybatisflex.kotlin.extensions.db.filter
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.tzdig.framework.mybatis.bo.CheckRankBO
import com.tzdig.framework.mybatis.dao.InternetSuperviseDAO
import com.tzdig.framework.mybatis.entity.prime.ExtHlwJgOrg
import com.tzdig.framework.service.InvestOnlineService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.sql.Timestamp
import java.time.LocalDateTime


@Tag(name = "监管排名")
@RestController
@RequestMapping("rank")
class EnterpriseCheckController(
    private val internetSuperviseDAO: InternetSuperviseDAO,
    private val investOnlineService: InvestOnlineService
) {
    @GetMapping("rank")
    @Operation(summary = "部门排名")
    fun getDeptRanking(@RequestParam year: Int): List<CheckRankBO> {
        val areaCode = investOnlineService.getCountyCode().map { it.take(6) }
        val areaCodeList = filter<ExtHlwJgOrg> {
            ExtHlwJgOrg::origion inList areaCode
        }.mapNotNull { it.organizationId }
        val startTime = Timestamp.valueOf(LocalDateTime.of(year, 1, 1, 0, 0, 0, 0))
        val endTime = Timestamp.valueOf(LocalDateTime.of(year, 12, 31, 23, 59, 59, 0))
        return internetSuperviseDAO.getDeptRanking(startTime, endTime, areaCodeList)
    }

    @GetMapping("rank2")
    @Operation(summary = "企业排名")
    fun getCompanyRanking(@RequestParam year: Int): List<CheckRankBO> {
        val areaCode = investOnlineService.getCountyCode().map {it.take(6) }
        val areaCodeList = filter<ExtHlwJgOrg> {
            ExtHlwJgOrg::origion inList areaCode
        }.mapNotNull { it.organizationId }
        val startTime = Timestamp.valueOf(LocalDateTime.of(year, 1, 1, 0, 0, 0, 0))
        val endTime = Timestamp.valueOf(LocalDateTime.of(year, 12, 31, 23, 59, 59, 0))
        return internetSuperviseDAO.getCompanyRanking(startTime, endTime, areaCodeList)
    }

    @GetMapping("deptRank")
    @Operation(summary = "部门检查企业排名")
    fun getDeptCompanyRanking(@RequestParam year: Int, @RequestParam dept: String): List<CheckRankBO> {
        val startTime = Timestamp.valueOf(LocalDateTime.of(year, 1, 1, 0, 0, 0, 0))
        val endTime = Timestamp.valueOf(LocalDateTime.of(year, 12, 31, 23, 59, 59, 0))
        return internetSuperviseDAO.getDeptCompanyRanking(startTime, endTime, dept)
    }

    @GetMapping("companyRank")
    @Operation(summary = "企业被部门检查排名")
    fun getCompanyDeptRanking(@RequestParam year: Int, @RequestParam company: String): List<CheckRankBO> {
        val startTime = Timestamp.valueOf(LocalDateTime.of(year, 1, 1, 0, 0, 0, 0))
        val endTime = Timestamp.valueOf(LocalDateTime.of(year, 12, 31, 23, 59, 59, 0))
        return internetSuperviseDAO.getCompanyDeptRanking(startTime, endTime, company)
    }
}
