package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.LhbMajorProjectStatus
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class LhbMajorProjectStatusDTO(
    @param:Schema(description = "市（区）")
    val cityDistrict: String?,
    @param:Schema(description = "① 项目数量")
    val projectCount: Int?,
    @param:Schema(description = "计划总投资")
    val plannedTotalInvestment: BigDecimal?,
    @param:Schema(description = "年度投资（计划）")
    val annualInvestmentPlan: BigDecimal?,
    @param:Schema(description = "年度投资完成情况-已列统项目数")
    val listedProjectCount: Int?,
    @param:Schema(description = "② 实际入库投资")
    val actualInvestedAmount: BigDecimal?,
    @param:Schema(description = "③ ☆投资完成率(%)")
    val investmentCompletionRate: BigDecimal?,
    @param:Schema(description = "④ 新开工项目数")
    val newStartedProjectCount: Int?,
    @param:Schema(description = "⑤ 已开工项目数")
    val startedProjectCount: Int?,
    @param:Schema(description = "⑥ 开工率(%)")
    val startRate: BigDecimal?,
    @param:Schema(description = "已开工未列统项目数")
    val startedUnlistedProjectCount: Int?,
) {
    fun toLhbMajorProjectStatus(): LhbMajorProjectStatus =
        LhbMajorProjectStatus {
            into(this)
        }

    fun into(record: LhbMajorProjectStatus): LhbMajorProjectStatus {
        record.cityDistrict = cityDistrict
        record.projectCount = projectCount
        record.plannedTotalInvestment = plannedTotalInvestment
        record.annualInvestmentPlan = annualInvestmentPlan
        record.listedProjectCount = listedProjectCount
        record.actualInvestedAmount = actualInvestedAmount
        record.investmentCompletionRate = investmentCompletionRate
        record.newStartedProjectCount = newStartedProjectCount
        record.startedProjectCount = startedProjectCount
        record.startRate = startRate
        record.startedUnlistedProjectCount = startedUnlistedProjectCount
        return record
    }
}
