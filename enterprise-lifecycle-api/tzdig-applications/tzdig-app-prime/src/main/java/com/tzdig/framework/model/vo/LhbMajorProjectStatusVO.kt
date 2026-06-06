package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.LhbMajorProjectStatus
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class LhbMajorProjectStatusVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "市（区）")
    @ExcelProperty("市（区）")
    val cityDistrict: String?,
    @get:Schema(description = "① 项目数量")
    @ExcelProperty("① 项目数量")
    val projectCount: Int?,
    @get:Schema(description = "计划总投资")
    @ExcelProperty("计划总投资")
    val plannedTotalInvestment: BigDecimal?,
    @get:Schema(description = "年度投资（计划）")
    @ExcelProperty("年度投资（计划）")
    val annualInvestmentPlan: BigDecimal?,
    @get:Schema(description = "年度投资完成情况-已列统项目数")
    @ExcelProperty("年度投资完成情况-已列统项目数")
    val listedProjectCount: Int?,
    @get:Schema(description = "② 实际入库投资")
    @ExcelProperty("② 实际入库投资")
    val actualInvestedAmount: BigDecimal?,
    @get:Schema(description = "③ ☆投资完成率(%)")
    @ExcelProperty("③ ☆投资完成率(%)")
    val investmentCompletionRate: BigDecimal?,
    @get:Schema(description = "④ 新开工项目数")
    @ExcelProperty("④ 新开工项目数")
    val newStartedProjectCount: Int?,
    @get:Schema(description = "⑤ 已开工项目数")
    @ExcelProperty("⑤ 已开工项目数")
    val startedProjectCount: Int?,
    @get:Schema(description = "⑥ 开工率(%)")
    @ExcelProperty("⑥ 开工率(%)")
    val startRate: BigDecimal?,
    @get:Schema(description = "已开工未列统项目数")
    @ExcelProperty("已开工未列统项目数")
    val startedUnlistedProjectCount: Int?,
) {
    constructor(record: LhbMajorProjectStatus) : this(
        id = record.id,
        cityDistrict = record.cityDistrict,
        projectCount = record.projectCount,
        plannedTotalInvestment = record.plannedTotalInvestment,
        annualInvestmentPlan = record.annualInvestmentPlan,
        listedProjectCount = record.listedProjectCount,
        actualInvestedAmount = record.actualInvestedAmount,
        investmentCompletionRate = record.investmentCompletionRate,
        newStartedProjectCount = record.newStartedProjectCount,
        startedProjectCount = record.startedProjectCount,
        startRate = record.startRate,
        startedUnlistedProjectCount = record.startedUnlistedProjectCount,
    )
}
