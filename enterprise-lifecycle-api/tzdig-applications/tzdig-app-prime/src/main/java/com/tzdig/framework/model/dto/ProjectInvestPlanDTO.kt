@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectInvestPlan
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

data class ProjectInvestPlanDTO(
    @param:Schema(description = "市区")
    val district: String?,
    @param:Schema(description = "项目代码")
    val projectCode: String?,
    @param:Schema(description = "项目名称")
    val projectName: String?,
    @param:Schema(description = "年度")
    val year: String?,
    @param:Schema(description = "年度计划投资金额")
    val planInvestAmount: BigDecimal?,
    @param:Schema(description = "发改委项目名称")
    val fgProjectName: String?,
    @param:Schema(description = "年度投资")
    val planTotalInvest: BigDecimal?,
    @param:Schema(description = "是否新开工")
    val ifNewBuild: String?,
) {
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
