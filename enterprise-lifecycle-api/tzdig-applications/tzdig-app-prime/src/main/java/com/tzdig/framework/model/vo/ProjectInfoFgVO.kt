package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectInfoFg
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate

data class ProjectInfoFgVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "发改项目名称")
    @ExcelProperty("发改项目名称")
    val fgProjectName: String?,
    @get:Schema(description = "全生命项目名称")
    @ExcelProperty("全生命项目名称")
    val fullLifecycleProjectName: String?,
    @get:Schema(description = "项目来源")
    @ExcelProperty("项目来源")
    val projectSource: String?,
    @get:Schema(description = "项目代码")
    @ExcelProperty("项目代码")
    val projectCode: String?,
    @get:Schema(description = "备案证项目代码")
    @ExcelProperty("备案证项目代码")
    val filingProjectCode: String?,
    @get:Schema(description = "申请备案时间")
    @ExcelProperty("申请备案时间")
    val filingApplicationTime: LocalDate?,
    @get:Schema(description = "建设规模")
    @ExcelProperty("建设规模")
    val constructionScale: String?,
    @get:Schema(description = "建设起止年限")
    @ExcelProperty("建设起止年限")
    val constructionStartEndYears: String?,
    @get:Schema(description = "计划总投资(含单位)")
    @ExcelProperty("计划总投资(含单位)")
    val plannedTotalInvestment: String?,
    @get:Schema(description = "计划总投资(数值)")
    @ExcelProperty("计划总投资(数值)")
    val plannedTotalInvestmentValue: BigDecimal?,
    @get:Schema(description = "从开工到2025年底预计完成投资")
    @ExcelProperty("从开工到2025年底预计完成投资")
    val expectedCompletedInvestmentTo2025: BigDecimal?,
    @get:Schema(description = "2026年计划投资(含单位)")
    @ExcelProperty("2026年计划投资(含单位)")
    val plannedInvestment2026: String?,
    @get:Schema(description = "2026年计划投资(数值)")
    @ExcelProperty("2026年计划投资(数值)")
    val plannedInvestment2026Value: BigDecimal?,
    @get:Schema(description = "截至2025年底建设进度或前期工作进展情况")
    @ExcelProperty("截至2025年底建设进度或前期工作进展情况")
    val progressToEnd2025: String?,
    @get:Schema(description = "2026年建设进度")
    @ExcelProperty("2026年建设进度")
    val constructionProgress2026: String?,
    @get:Schema(description = "是否新开工")
    @ExcelProperty("是否新开工")
    val isNewStart: String?,
    @get:Schema(description = "(预计)开工时间")
    @ExcelProperty("(预计)开工时间")
    val expectedStartTime: LocalDate?,
    @get:Schema(description = "(预计)首次达产时间")
    @ExcelProperty("(预计)首次达产时间")
    val expectedFirstProductionTime: LocalDate?,
    @get:Schema(description = "投资主体名称")
    @ExcelProperty("投资主体名称")
    val investmentEntityName: String?,
    @get:Schema(description = "服务推进责任单位")
    @ExcelProperty("服务推进责任单位")
    val responsibleUnit: String?,
    @get:Schema(description = "项目所在园区、乡镇/街道")
    @ExcelProperty("项目所在园区、乡镇/街道")
    val projectLocation: String?,
    @get:Schema(description = "投资性质")
    @ExcelProperty("投资性质")
    val investmentNature: String?,
) {
    constructor(record: ProjectInfoFg) : this(
        id = record.id,
        fgProjectName = record.fgProjectName,
        fullLifecycleProjectName = record.fullLifecycleProjectName,
        projectSource = record.projectSource,
        projectCode = record.projectCode,
        filingProjectCode = record.filingProjectCode,
        filingApplicationTime = record.filingApplicationTime,
        constructionScale = record.constructionScale,
        constructionStartEndYears = record.constructionStartEndYears,
        plannedTotalInvestment = record.plannedTotalInvestment,
        plannedTotalInvestmentValue = record.plannedTotalInvestmentValue,
        expectedCompletedInvestmentTo2025 = record.expectedCompletedInvestmentTo2025,
        plannedInvestment2026 = record.plannedInvestment2026,
        plannedInvestment2026Value = record.plannedInvestment2026Value,
        progressToEnd2025 = record.progressToEnd2025,
        constructionProgress2026 = record.constructionProgress2026,
        isNewStart = record.isNewStart,
        expectedStartTime = record.expectedStartTime,
        expectedFirstProductionTime = record.expectedFirstProductionTime,
        investmentEntityName = record.investmentEntityName,
        responsibleUnit = record.responsibleUnit,
        projectLocation = record.projectLocation,
        investmentNature = record.investmentNature,
    )
}
