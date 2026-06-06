package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectInfoFg
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate

data class ProjectInfoFgDTO(
    @param:Schema(description = "发改项目名称")
    val fgProjectName: String?,
    @param:Schema(description = "全生命项目名称")
    val fullLifecycleProjectName: String?,
    @param:Schema(description = "项目来源")
    val projectSource: String?,
    @param:Schema(description = "项目代码")
    val projectCode: String?,
    @param:Schema(description = "备案证项目代码")
    val filingProjectCode: String?,
    @param:Schema(description = "申请备案时间")
    val filingApplicationTime: LocalDate?,
    @param:Schema(description = "建设规模")
    val constructionScale: String?,
    @param:Schema(description = "建设起止年限")
    val constructionStartEndYears: String?,
    @param:Schema(description = "计划总投资(含单位)")
    val plannedTotalInvestment: String?,
    @param:Schema(description = "计划总投资(数值)")
    val plannedTotalInvestmentValue: BigDecimal?,
    @param:Schema(description = "从开工到2025年底预计完成投资")
    val expectedCompletedInvestmentTo2025: BigDecimal?,
    @param:Schema(description = "2026年计划投资(含单位)")
    val plannedInvestment2026: String?,
    @param:Schema(description = "2026年计划投资(数值)")
    val plannedInvestment2026Value: BigDecimal?,
    @param:Schema(description = "截至2025年底建设进度或前期工作进展情况")
    val progressToEnd2025: String?,
    @param:Schema(description = "2026年建设进度")
    val constructionProgress2026: String?,
    @param:Schema(description = "是否新开工")
    val isNewStart: String?,
    @param:Schema(description = "(预计)开工时间")
    val expectedStartTime: LocalDate?,
    @param:Schema(description = "(预计)首次达产时间")
    val expectedFirstProductionTime: LocalDate?,
    @param:Schema(description = "投资主体名称")
    val investmentEntityName: String?,
    @param:Schema(description = "服务推进责任单位")
    val responsibleUnit: String?,
    @param:Schema(description = "项目所在园区、乡镇/街道")
    val projectLocation: String?,
    @param:Schema(description = "投资性质")
    val investmentNature: String?,
) {
    fun toProjectInfoFg(): ProjectInfoFg =
        ProjectInfoFg {
            into(this)
        }

    fun into(record: ProjectInfoFg): ProjectInfoFg {
        record.fgProjectName = fgProjectName
        record.fullLifecycleProjectName = fullLifecycleProjectName
        record.projectSource = projectSource
        record.projectCode = projectCode
        record.filingProjectCode = filingProjectCode
        record.filingApplicationTime = filingApplicationTime
        record.constructionScale = constructionScale
        record.constructionStartEndYears = constructionStartEndYears
        record.plannedTotalInvestment = plannedTotalInvestment
        record.plannedTotalInvestmentValue = plannedTotalInvestmentValue
        record.expectedCompletedInvestmentTo2025 = expectedCompletedInvestmentTo2025
        record.plannedInvestment2026 = plannedInvestment2026
        record.plannedInvestment2026Value = plannedInvestment2026Value
        record.progressToEnd2025 = progressToEnd2025
        record.constructionProgress2026 = constructionProgress2026
        record.isNewStart = isNewStart
        record.expectedStartTime = expectedStartTime
        record.expectedFirstProductionTime = expectedFirstProductionTime
        record.investmentEntityName = investmentEntityName
        record.responsibleUnit = responsibleUnit
        record.projectLocation = projectLocation
        record.investmentNature = investmentNature
        return record
    }
}
