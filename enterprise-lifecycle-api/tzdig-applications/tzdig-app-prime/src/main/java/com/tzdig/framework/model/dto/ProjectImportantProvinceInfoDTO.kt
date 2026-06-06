@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectImportantProvinceInfo
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate

data class ProjectImportantProvinceInfoDTO(
    @Schema(description = "年份")
    val year: Int?,
    @Schema(description = "级别（如：省、市）")
    val level: String?,
    @Schema(description = "企业名称")
    val companyName: String?,
    @Schema(description = "项目名称")
    val projectName: String?,
    @Schema(description = "项目建设内容和规模")
    val constructionContentAndScale: String?,
    @Schema(description = "所属板块")
    val sector: String?,
    @Schema(description = "项目融资需求（万元）")
    val financingDemand: BigDecimal?,
    @Schema(description = "到202X-1年底累计完成投资（万元）")
    val cumulativeInvestmentToPrevYear: BigDecimal?,
    @Schema(description = "202X年计划投资（万元）")
    val plannedInvestmentCurrentYear: BigDecimal?,
    @Schema(description = "预计新增经济效益-销售（万元）")
    val expectedSales: BigDecimal?,
    @Schema(description = "预计新增经济效益-利润（万元）")
    val expectedProfit: BigDecimal?,
    @Schema(description = "预计新增经济效益-税金（万元）")
    val expectedTax: BigDecimal?,
    @Schema(description = "项目起止年月（起），示例：2022年1月")
    val startDate: LocalDate?,
    @Schema(description = "项目起止年月（止），示例：2024年12月")
    val endDate: LocalDate?,
    @Schema(description = "项目所属园区")
    val park: String?,
    @Schema(description = "项目阶段（如：续建结转下年）")
    val projectStage: String?,
    @Schema(description = "当年完成投资（万元）")
    val investmentCompletedCurrentYear: BigDecimal?,
    @Schema(description = "项目形象进度")
    val projectProgress: String?,
    @Schema(description = "行业分类")
    val industryClassification: String?,
) {
    fun toProjectImportantProvinceInfo(): ProjectImportantProvinceInfo =
        ProjectImportantProvinceInfo {
            into(this)
        }

    fun into(record: ProjectImportantProvinceInfo): ProjectImportantProvinceInfo {
        record.year = year
        record.level = level
        record.companyName = companyName
        record.projectName = projectName
        record.constructionContentAndScale = constructionContentAndScale
        record.sector = sector
        record.financingDemand = financingDemand
        record.cumulativeInvestmentToPrevYear = cumulativeInvestmentToPrevYear
        record.plannedInvestmentCurrentYear = plannedInvestmentCurrentYear
        record.expectedSales = expectedSales
        record.expectedProfit = expectedProfit
        record.expectedTax = expectedTax
        record.startDate = startDate
        record.endDate = endDate
        record.park = park
        record.projectStage = projectStage
        record.investmentCompletedCurrentYear = investmentCompletedCurrentYear
        record.projectProgress = projectProgress
        record.industryClassification = industryClassification
        return record
    }
}
