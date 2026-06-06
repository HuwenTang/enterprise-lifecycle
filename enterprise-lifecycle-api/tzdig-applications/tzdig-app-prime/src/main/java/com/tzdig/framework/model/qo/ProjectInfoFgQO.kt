package com.tzdig.framework.model.qo

import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate

data class ProjectInfoFgQO(
    @param:Schema(description = "发改项目名称")
    val fgProjectName: String? = null,
    @param:Schema(description = "全生命项目名称")
    val fullLifecycleProjectName: String? = null,
    @param:Schema(description = "项目来源")
    val projectSource: String? = null,
    @param:Schema(description = "项目代码")
    val projectCode: String? = null,
    @param:Schema(description = "备案证项目代码")
    val filingProjectCode: String? = null,
    @param:Schema(description = "申请备案时间")
    val filingApplicationTime: LocalDate? = null,
    @param:Schema(description = "建设规模")
    val constructionScale: String? = null,
    @param:Schema(description = "建设起止年限")
    val constructionStartEndYears: String? = null,
    @param:Schema(description = "计划总投资(含单位)")
    val plannedTotalInvestment: String? = null,
    @param:Schema(description = "计划总投资(数值)")
    val plannedTotalInvestmentValue: BigDecimal? = null,
    @param:Schema(description = "从开工到2025年底预计完成投资")
    val expectedCompletedInvestmentTo2025: BigDecimal? = null,
    @param:Schema(description = "2026年计划投资(含单位)")
    val plannedInvestment2026: String? = null,
    @param:Schema(description = "2026年计划投资(数值)")
    val plannedInvestment2026Value: BigDecimal? = null,
    @param:Schema(description = "截至2025年底建设进度或前期工作进展情况")
    val progressToEnd2025: String? = null,
    @param:Schema(description = "2026年建设进度")
    val constructionProgress2026: String? = null,
    @param:Schema(description = "是否新开工")
    val isNewStart: String? = null,
    @param:Schema(description = "(预计)开工时间")
    val expectedStartTime: LocalDate? = null,
    @param:Schema(description = "(预计)首次达产时间")
    val expectedFirstProductionTime: LocalDate? = null,
    @param:Schema(description = "投资主体名称")
    val investmentEntityName: String? = null,
    @param:Schema(description = "服务推进责任单位")
    val responsibleUnit: String? = null,
    @param:Schema(description = "项目所在园区、乡镇/街道")
    val projectLocation: String? = null,
    @param:Schema(description = "投资性质")
    val investmentNature: String? = null,
    @param:Schema(description = "所在市区")
    val city: String? = null,
)
