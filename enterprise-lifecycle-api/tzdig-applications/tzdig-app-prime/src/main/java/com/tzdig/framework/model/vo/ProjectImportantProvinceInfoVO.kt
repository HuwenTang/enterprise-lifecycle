@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectImportantProvinceInfo
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate

data class ProjectImportantProvinceInfoVO(
    @Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @Schema(description = "年份")
    @ExcelProperty("年份")
    val year: Int?,
    @Schema(description = "级别（如：省、市）")
    @ExcelProperty("级别（如：省、市）")
    val level: String?,
    @Schema(description = "企业名称")
    @ExcelProperty("企业名称")
    val companyName: String?,
    @Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String?,
    @Schema(description = "项目建设内容和规模")
    @ExcelProperty("项目建设内容和规模")
    val constructionContentAndScale: String?,
    @Schema(description = "所属板块")
    @ExcelProperty("所属板块")
    val sector: String?,
    @Schema(description = "项目融资需求（万元）")
    @ExcelProperty("项目融资需求（万元）")
    val financingDemand: BigDecimal?,
    @Schema(description = "到202X-1年底累计完成投资（万元）")
    @ExcelProperty("到202X-1年底累计完成投资（万元）")
    val cumulativeInvestmentToPrevYear: BigDecimal?,
    @Schema(description = "202X年计划投资（万元）")
    @ExcelProperty("202X年计划投资（万元）")
    val plannedInvestmentCurrentYear: BigDecimal?,
    @Schema(description = "预计新增经济效益-销售（万元）")
    @ExcelProperty("预计新增经济效益-销售（万元）")
    val expectedSales: BigDecimal?,
    @Schema(description = "预计新增经济效益-利润（万元）")
    @ExcelProperty("预计新增经济效益-利润（万元）")
    val expectedProfit: BigDecimal?,
    @Schema(description = "预计新增经济效益-税金（万元）")
    @ExcelProperty("预计新增经济效益-税金（万元）")
    val expectedTax: BigDecimal?,
    @Schema(description = "项目起止年月（起），示例：2022年1月")
    @ExcelProperty("项目起止年月（起），示例：2022年1月")
    val startDate: LocalDate?,
    @Schema(description = "项目起止年月（止），示例：2024年12月")
    @ExcelProperty("项目起止年月（止），示例：2024年12月")
    val endDate: LocalDate?,
    @Schema(description = "项目所属园区")
    @ExcelProperty("项目所属园区")
    val park: String?,
    @Schema(description = "项目阶段（如：续建结转下年）")
    @ExcelProperty("项目阶段（如：续建结转下年）")
    val projectStage: String?,
    @Schema(description = "当年完成投资（万元）")
    @ExcelProperty("当年完成投资（万元）")
    val investmentCompletedCurrentYear: BigDecimal?,
    @Schema(description = "项目形象进度")
    @ExcelProperty("项目形象进度")
    val projectProgress: String?,
    @Schema(description = "行业分类")
    @ExcelProperty("行业分类")
    val industryClassification: String?,
) {
    constructor(record: ProjectImportantProvinceInfo) : this(
        id = record.id,
        year = record.year,
        level = record.level,
        companyName = record.companyName,
        projectName = record.projectName,
        constructionContentAndScale = record.constructionContentAndScale,
        sector = record.sector,
        financingDemand = record.financingDemand,
        cumulativeInvestmentToPrevYear = record.cumulativeInvestmentToPrevYear,
        plannedInvestmentCurrentYear = record.plannedInvestmentCurrentYear,
        expectedSales = record.expectedSales,
        expectedProfit = record.expectedProfit,
        expectedTax = record.expectedTax,
        startDate = record.startDate,
        endDate = record.endDate,
        park = record.park,
        projectStage = record.projectStage,
        investmentCompletedCurrentYear = record.investmentCompletedCurrentYear,
        projectProgress = record.projectProgress,
        industryClassification = record.industryClassification,
    )
}
