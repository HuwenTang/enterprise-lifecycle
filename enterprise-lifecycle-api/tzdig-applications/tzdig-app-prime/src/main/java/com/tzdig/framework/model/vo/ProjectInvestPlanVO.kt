@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectInvestPlan
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectInvestPlanVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "市区")
    @ExcelProperty("市区")
    val district: String?,
    @get:Schema(description = "项目代码")
    @ExcelProperty("项目代码")
    val projectCode: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String?,
    @get:Schema(description = "年度")
    @ExcelProperty("年度")
    val year: String?,
    @get:Schema(description = "年度计划投资金额")
    @ExcelProperty("年度计划投资金额")
    val planInvestAmount: BigDecimal?,
    @get:Schema(description = "发改委项目名称")
    @ExcelProperty("发改委项目名称")
    val fgProjectName: String?,
    @get:Schema(description = "年度投资")
    @ExcelProperty("年度投资")
    val planTotalInvest: BigDecimal?,
    @get:Schema(description = "是否新开工")
    @ExcelProperty("是否新开工")
    val ifNewBuild: String?,
) {
    constructor(record: ProjectInvestPlan) : this(
        id = record.id,
        district = record.district,
        projectCode = record.projectCode,
        projectName = record.projectName,
        year = record.year,
        planInvestAmount = record.planInvestAmount,
        fgProjectName = record.fgProjectName,
        planTotalInvest = record.planTotalInvest,
        ifNewBuild = record.ifNewBuild,
    )
}
