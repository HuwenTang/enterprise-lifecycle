@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectFagaiKeyProjects
import com.tzdig.framework.web.annotation.JsonAreaName
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate

data class ProjectFagaiKeyProjectsVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String,
    @get:Schema(description = "市（区）")
    val district: String,
    @get:Schema(description = "园区")
    val park: String,
    @get:Schema(description = "8+13+x，如：生物医药")
    @ExcelProperty("8+13+x，如：生物医药")
    val innovativeClusters813X: String?,
    @get:Schema(description = "8个创新集群")
    @ExcelProperty("8个创新集群")
    val innovativeCluster: String?,
    @get:Schema(description = "13条产业链")
    @ExcelProperty("13条产业链")
    val industrialChain: String?,
    @get:Schema(description = "项目类型: 1&#61;开工 2&#61;竣工")
    @ExcelProperty("项目类型: 1&#61;开工 2&#61;竣工")
    val projectType: Int?,
    @get:Schema(description = "投资主体（企业名称）")
    @ExcelProperty("投资主体（企业名称）")
    val investmentEntityAndName: String?,
    @get:Schema(description = "是否为市级重点项目")
    @ExcelProperty("是否为市级重点项目")
    val isMunicipalKey: Boolean?,
    @get:Schema(description = "是否为省级重点项目")
    @ExcelProperty("是否为省级重点项目")
    val isProvienceKey: Boolean?,
    @get:Schema(description = "是否为亿元以上项目")
    @ExcelProperty("是否为亿元以上项目")
    val isOverOneBillion: Boolean?,
    @get:Schema(description = "是否为十亿元以上项目")
    @ExcelProperty("是否为十亿元以上项目")
    val isOverTenBillion: Boolean?,
    @get:Schema(description = "是否为外资项目")
    @ExcelProperty("是否为外资项目")
    val isOut: Boolean?,
    @get:Schema(description = "统一社会信用代码（18位）")
    @ExcelProperty("统一社会信用代码（18位）")
    val uscc: String?,
    @get:Schema(description = "统计库项目编码")
    @ExcelProperty("统计库项目编码")
    val statisticalProjectCode: String?,
    @get:Schema(description = "统计库中登记的项目名称")
    @ExcelProperty("统计库中登记的项目名称")
    val statisticalProjectName: String?,
    @get:Schema(description = "是否在建（根据实际判断）")
    @ExcelProperty("是否在建（根据实际判断）")
    val isUnderConstruction: Boolean?,
    @get:Schema(description = "建设规模及主要内容")
    @ExcelProperty("建设规模及主要内容")
    val constructionScale: String?,
    @get:Schema(description = "建设性质：新建、扩建、租赁、技改等")
    @ExcelProperty("建设性质：新建、扩建、租赁、技改等")
    val constructionNature: String?,
    @get:Schema(description = "实际开工时间（格式：YYYY-MM-DD）")
    @ExcelProperty("实际开工时间（格式：YYYY-MM-DD）")
    val startDate: LocalDate?,
    @get:Schema(description = "实际竣工时间（格式：YYYY-MM-DD）")
    @ExcelProperty("实际竣工时间（格式：YYYY-MM-DD）")
    val completionDate: LocalDate?,
    @get:Schema(description = "计划总投资（内资+外资）（万元）")
    @ExcelProperty("计划总投资（内资+外资）（万元）")
    val plannedTotalInvestmentAll: BigDecimal?,
    @get:Schema(description = "计划总投资 - 内资（万元）")
    @ExcelProperty("计划总投资 - 内资（万元）")
    val plannedTotalInvestmentDomestic: BigDecimal?,
    @get:Schema(description = "计划总投资 - 外资（万元）")
    @ExcelProperty("计划总投资 - 外资（万元）")
    val plannedTotalInvestmentForeign: BigDecimal?,
    @get:Schema(description = "项目实际投资（内资+外资）（万元）")
    @ExcelProperty("项目实际投资（内资+外资）（万元）")
    val actualTotalInvestmentAll: BigDecimal?,
    @get:Schema(description = "项目实际投资内资（万元）")
    @ExcelProperty("项目实际投资内资（万元）")
    val actualTotalInvestmentDomestic: BigDecimal?,
    @get:Schema(description = "项目实际投资-外资（万元）")
    @ExcelProperty("项目实际投资-外资（万元）")
    val actualTotalInvestmentForeign: BigDecimal?,
    @get:Schema(description = "年度计划投资（万元）")
    @ExcelProperty("年度计划投资（万元）")
    val annualPlannedInvestment: BigDecimal?,
    @get:Schema(description = "项目在库计划总投资（万元）")
    @ExcelProperty("项目在库计划总投资（万元）")
    val statisticalTotalInvestment: BigDecimal?,
    @get:Schema(description = "项目列统投资累计列统投资(万元)")
    @ExcelProperty("项目列统投资累计列统投资(万元)")
    val statisticalActualTotalInvestment: BigDecimal?,
    @get:Schema(description = "项目代码（备案证号）")
    @ExcelProperty("项目代码（备案证号）")
    val projectRecordCode: String?,
) {
    @Suppress("unused")
    @get:Schema(description = "市（区）")
    @get:JsonAreaName
    val districtName: String
        get() = district

    @Suppress("unused")
    @get:Schema(description = "园区")
    @get:JsonAreaName
    val parkName: String
        get() = park

    constructor(record: ProjectFagaiKeyProjects) : this(
        id = record.id!!,
        district = record.district!!,
        park = record.park!!,
        innovativeClusters813X = record.innovativeClusters813X,
        innovativeCluster = record.innovativeCluster,
        industrialChain = record.industrialChain,
        projectType = record.projectType,
        investmentEntityAndName = record.investmentEntityAndName,
        isMunicipalKey = record.isMunicipalKey,
        isProvienceKey = record.isProvienceKey,
        isOverOneBillion = record.isOverOneBillion,
        isOverTenBillion = record.isOverTenBillion,
        isOut = record.isOut,
        uscc = record.uscc,
        statisticalProjectCode = record.statisticalProjectCode,
        statisticalProjectName = record.statisticalProjectName,
        isUnderConstruction = record.isUnderConstruction,
        constructionScale = record.constructionScale,
        constructionNature = record.constructionNature,
        startDate = record.startDate,
        completionDate = record.completionDate,
        plannedTotalInvestmentAll = record.plannedTotalInvestmentAll,
        plannedTotalInvestmentDomestic = record.plannedTotalInvestmentDomestic,
        plannedTotalInvestmentForeign = record.plannedTotalInvestmentForeign,
        actualTotalInvestmentAll = record.actualTotalInvestmentAll,
        actualTotalInvestmentDomestic = record.actualTotalInvestmentDomestic,
        actualTotalInvestmentForeign = record.actualTotalInvestmentForeign,
        annualPlannedInvestment = record.annualPlannedInvestment,
        statisticalTotalInvestment = record.statisticalTotalInvestment,
        statisticalActualTotalInvestment = record.statisticalActualTotalInvestment,
        projectRecordCode = record.projectRecordCode,
    )
}
