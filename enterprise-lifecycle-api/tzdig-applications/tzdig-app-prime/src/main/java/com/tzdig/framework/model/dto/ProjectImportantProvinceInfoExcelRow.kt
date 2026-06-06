@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectImportantProvinceInfo
import java.math.BigDecimal
import java.time.LocalDate

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectImportantProvinceInfoExcelRow(
    @ExcelProperty("年份")
    var year: Int? = null,
    @ExcelProperty("级别（如：省、市）")
    var level: String? = null,
    @ExcelProperty("企业名称")
    var companyName: String? = null,
    @ExcelProperty("项目名称")
    var projectName: String? = null,
    @ExcelProperty("项目建设内容和规模")
    var constructionContentAndScale: String? = null,
    @ExcelProperty("所属板块")
    var sector: String? = null,
    @ExcelProperty("项目融资需求（万元）")
    var financingDemand: BigDecimal? = null,
    @ExcelProperty("到202X-1年底累计完成投资（万元）")
    var cumulativeInvestmentToPrevYear: BigDecimal? = null,
    @ExcelProperty("202X年计划投资（万元）")
    var plannedInvestmentCurrentYear: BigDecimal? = null,
    @ExcelProperty("预计新增经济效益-销售（万元）")
    var expectedSales: BigDecimal? = null,
    @ExcelProperty("预计新增经济效益-利润（万元）")
    var expectedProfit: BigDecimal? = null,
    @ExcelProperty("预计新增经济效益-税金（万元）")
    var expectedTax: BigDecimal? = null,
    @ExcelProperty("项目起止年月（起），示例：2022年1月")
    var startDate: LocalDate? = null,
    @ExcelProperty("项目起止年月（止），示例：2024年12月")
    var endDate: LocalDate? = null,
    @ExcelProperty("项目所属园区")
    var park: String? = null,
    @ExcelProperty("项目阶段（如：续建结转下年）")
    var projectStage: String? = null,
    @ExcelProperty("当年完成投资（万元）")
    var investmentCompletedCurrentYear: BigDecimal? = null,
    @ExcelProperty("项目形象进度")
    var projectProgress: String? = null,
    @ExcelProperty("行业分类")
    var industryClassification: String? = null,
) : ExcelRow<ProjectImportantProvinceInfoExcelRow>() {
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
