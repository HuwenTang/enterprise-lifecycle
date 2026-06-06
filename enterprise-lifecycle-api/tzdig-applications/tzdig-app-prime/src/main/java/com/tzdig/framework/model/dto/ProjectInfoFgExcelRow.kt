package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectInfoFg
import java.math.BigDecimal
import java.time.LocalDate

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectInfoFgExcelRow(
    @field:ExcelProperty("发改项目名称")
    var fgProjectName: String? = null,
    @field:ExcelProperty("全生命项目名称")
    var fullLifecycleProjectName: String? = null,
    @field:ExcelProperty("项目来源")
    var projectSource: String? = null,
    @field:ExcelProperty("项目代码")
    var projectCode: String? = null,
    @field:ExcelProperty("备案证项目代码")
    var filingProjectCode: String? = null,
    @field:ExcelProperty("申请备案时间")
    var filingApplicationTime: LocalDate? = null,
    @field:ExcelProperty("建设规模")
    var constructionScale: String? = null,
    @field:ExcelProperty("建设起止年限")
    var constructionStartEndYears: String? = null,
    @field:ExcelProperty("计划总投资(含单位)")
    var plannedTotalInvestment: String? = null,
    @field:ExcelProperty("计划总投资(数值)")
    var plannedTotalInvestmentValue: BigDecimal? = null,
    @field:ExcelProperty("从开工到2025年底预计完成投资")
    var expectedCompletedInvestmentTo2025: BigDecimal? = null,
    @field:ExcelProperty("2026年计划投资(含单位)")
    var plannedInvestment2026: String? = null,
    @field:ExcelProperty("2026年计划投资(数值)")
    var plannedInvestment2026Value: BigDecimal? = null,
    @field:ExcelProperty("截至2025年底建设进度或前期工作进展情况")
    var progressToEnd2025: String? = null,
    @field:ExcelProperty("2026年建设进度")
    var constructionProgress2026: String? = null,
    @field:ExcelProperty("是否新开工")
    var isNewStart: String? = null,
    @field:ExcelProperty("(预计)开工时间")
    var expectedStartTime: LocalDate? = null,
    @field:ExcelProperty("(预计)首次达产时间")
    var expectedFirstProductionTime: LocalDate? = null,
    @field:ExcelProperty("投资主体名称")
    var investmentEntityName: String? = null,
    @field:ExcelProperty("服务推进责任单位")
    var responsibleUnit: String? = null,
    @field:ExcelProperty("项目所在园区、乡镇/街道")
    var projectLocation: String? = null,
    @field:ExcelProperty("投资性质")
    var investmentNature: String? = null,
) : ExcelRow<ProjectInfoFgExcelRow>() {
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
