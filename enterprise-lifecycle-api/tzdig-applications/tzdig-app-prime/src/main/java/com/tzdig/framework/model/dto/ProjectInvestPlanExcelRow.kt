@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestPlan
import java.math.BigDecimal

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectInvestPlanExcelRow(
    @field:ExcelProperty("市区")
    var district: String? = null,
    @field:ExcelProperty("项目代码")
    var projectCode: String? = null,
    @field:ExcelProperty("项目名称")
    var projectName: String? = null,
    @field:ExcelProperty("年度")
    var year: String? = null,
    @field:ExcelProperty("年度计划投资金额")
    var planInvestAmount: BigDecimal? = null,
    @field:ExcelProperty("发改委项目名称")
    var fgProjectName: String? = null,
    @field:ExcelProperty("年度投资")
    var planTotalInvest: BigDecimal? = null,
    @field:ExcelProperty("是否新开工")
    var ifNewBuild: String? = null,
) : ExcelRow<ProjectInvestPlanExcelRow>() {
    fun toProjectInvestPlan(): ProjectInvestPlan =
        ProjectInvestPlan {
            into(this)
        }

    fun into(record: ProjectInvestPlan): ProjectInvestPlan {
        record.district = district
        record.projectCode = projectCode
        record.projectName = projectName
        record.year = year
        record.planInvestAmount = planInvestAmount
        record.fgProjectName = fgProjectName
        record.planTotalInvest = planTotalInvest
        record.ifNewBuild = ifNewBuild
        return record
    }
}
