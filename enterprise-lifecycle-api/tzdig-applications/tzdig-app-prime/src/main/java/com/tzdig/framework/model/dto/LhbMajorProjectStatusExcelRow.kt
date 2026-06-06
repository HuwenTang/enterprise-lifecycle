package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.LhbMajorProjectStatus
import java.math.BigDecimal

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class LhbMajorProjectStatusExcelRow(
    @field:ExcelProperty("市（区）")
    var cityDistrict: String? = null,
    @field:ExcelProperty("① 项目数量")
    var projectCount: Int? = null,
    @field:ExcelProperty("计划总投资")
    var plannedTotalInvestment: BigDecimal? = null,
    @field:ExcelProperty("年度投资（计划）")
    var annualInvestmentPlan: BigDecimal? = null,
    @field:ExcelProperty("年度投资完成情况-已列统项目数")
    var listedProjectCount: Int? = null,
    @field:ExcelProperty("② 实际入库投资")
    var actualInvestedAmount: BigDecimal? = null,
    @field:ExcelProperty("③ ☆投资完成率(%)")
    var investmentCompletionRate: BigDecimal? = null,
    @field:ExcelProperty("④ 新开工项目数")
    var newStartedProjectCount: Int? = null,
    @field:ExcelProperty("⑤ 已开工项目数")
    var startedProjectCount: Int? = null,
    @field:ExcelProperty("⑥ 开工率(%)")
    var startRate: BigDecimal? = null,
    @field:ExcelProperty("已开工未列统项目数")
    var startedUnlistedProjectCount: Int? = null,
) : ExcelRow<LhbMajorProjectStatusExcelRow>() {
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
