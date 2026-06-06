@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.mybatis.entity.prime.ProjectFilingInfo
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class ProjectFilingInfoVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "市（区），如：靖江市、泰兴市等")
    @ExcelProperty("市（区），如：靖江市、泰兴市等")
    val district: String?,
    @get:Schema(description = "park")
    @ExcelProperty("park")
    val park: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String?,
    @get:Schema(description = "备案时的项目名称")
    @ExcelProperty("备案时的项目名称")
    val filingProjectName: String?,
    @get:Schema(description = "申报单位")
    @ExcelProperty("申报单位")
    val applicationUnit: String?,
    @get:Schema(description = "项目投资额 (万元)")
    @ExcelProperty("项目投资额 (万元)")
    val investmentAmount: BigDecimal?,
    @get:Schema(description = "项目代码")
    @ExcelProperty("项目代码")
    val projectCode: String?,
    @get:Schema(description = "建设规模")
    @ExcelProperty("建设规模")
    val constructionScale: String?,
    @get:Schema(description = "备案证号")
    @ExcelProperty("备案证号")
    val filingCertificateNo: String?,
    @get:Schema(description = "申请备案时间")
    @ExcelProperty("申请备案时间")
    val applyFilingTime: LocalDateTime?,
    @get:Schema(description = "完成备案时间")
    @ExcelProperty("完成备案时间")
    val completeFilingTime: LocalDate?,
    @get:Schema(description = "是否外资项目 (0:否, 1:是)")
    @ExcelProperty("是否外资项目 (0:否, 1:是)")
    val isForeignInvestment: Boolean?,
    @get:Schema(description = "法人单位信息")
    @ExcelProperty("法人单位信息")
    val legalEntityInfo: String?,
    @get:Schema(description = "备案部门")
    @ExcelProperty("备案部门")
    val filingDepartment: String?,
    @get:Schema(description = "项目类型（工业、服务业）")
    @ExcelProperty("项目类型（工业、服务业）")
    val projectType: String?,
    @get:Schema(description = "产业方向（工业项目选“8+13+X”类别或“其他”）")
    @ExcelProperty("产业方向（工业项目选“8+13+X”类别或“其他”）")
    val industryDirection: String?,

    @get:Schema(description = "用地类型")
    @ExcelProperty("用地类型")
    val landUseType: String?,
    @get:Schema(description = "供地进展（新增用地项目填写）")
    @ExcelProperty("供地进展（新增用地项目填写）")
    val landSupplyProgress: String?,
    @get:Schema(description = "环评进展")
    @ExcelProperty("环评进展")
    val environmentalAssessmentStatus: String?,
    @get:Schema(description = "安评情况")
    @ExcelProperty("安评情况")
    val safetyAssessmentStatus: String?,
    @get:Schema(description = "能评情况")
    @ExcelProperty("能评情况")
    val energyAssessmentStatus: String?,
    @get:Schema(description = "施工图审查情况")
    @ExcelProperty("施工图审查情况")
    val constructionDrawingReviewStatus: String?,
    @get:Schema(description = "施工许可情况")
    @ExcelProperty("施工许可情况")
    val constructionPermitStatus: String?,
    @get:Schema(description = "规划许可情况")
    @ExcelProperty("规划许可情况")
    val planningPermitStatus: String?,
) {
    @get:Schema(description = "环评进展颜色")
    val environmentalAssessmentStatusColor: String?
        get() = when (environmentalAssessmentStatus) {
            "1.环境影响报告书 已完成" -> "#67ad5c"
            "2.环境影响报告表 已完成" -> "#67ad5c"
            "3.环境影响登记表 已完成" -> "#67ad5c"
            "4.未完成" -> "#4994ec"
            else -> null
        }

    @get:Schema(description = "安评情况颜色")
    val safetyAssessmentStatusColor: String?
        get() = when (safetyAssessmentStatus) {
            "1.已完成" -> "#67ad5c"
            "2.未完成" -> "#4994ec"
            "4.未完成" -> "#4994ec"
            else -> null
        }

    @get:Schema(description = "能评情况颜色")
    val energyAssessmentStatusColor: String?
        get() = when (energyAssessmentStatus) {
            "1.无需能评" -> "#9e9e9e"
            "2.已完成" -> "#67ad5c"
            "3.未完成" -> "#4994ec"
            else -> null
        }

    @get:Schema(description = "施工图审查情况颜色")
    val constructionDrawingReviewStatusColor: String?
        get() = when (constructionDrawingReviewStatus) {
            "1.无需施工图审查" -> "#9e9e9e"
            "2.已完成施工图审查" -> "#67ad5c"
            "3.未完成施工图审查" -> "#4994ec"
            else -> null
        }

    @get:Schema(description = "施工许可情况颜色")
    val constructionPermitStatusColor: String?
        get() = when (constructionPermitStatus) {
            "1.无需施工许可" -> "#9e9e9e"
            "2.未取得施工许可" -> "#4994ec"
            "3.已取得施工许可" -> "#67ad5c"
            else -> null
        }

    constructor(record: ProjectFilingInfo) : this(
        id = record.id,
        district = record.district,
        park = record.park,
        projectName = record.projectName,
        filingProjectName = record.filingProjectName,
        applicationUnit = record.applicationUnit,
        investmentAmount = record.investmentAmount,
        projectCode = record.projectCode,
        constructionScale = record.constructionScale,
        filingCertificateNo = record.filingCertificateNo,
        applyFilingTime = record.applyFilingTime,
        completeFilingTime = record.completeFilingTime,
        isForeignInvestment = record.isForeignInvestment,
        legalEntityInfo = record.legalEntityInfo,
        filingDepartment = record.filingDepartment,
        projectType = record.projectType,
        industryDirection = record.industryDirection,
        landUseType = record.landUseType,
        landSupplyProgress = record.landSupplyProgress,
        environmentalAssessmentStatus = record.environmentalAssessmentStatus,
        safetyAssessmentStatus = record.safetyAssessmentStatus,
        energyAssessmentStatus = record.energyAssessmentStatus,
        constructionDrawingReviewStatus = record.constructionDrawingReviewStatus,
        constructionPermitStatus = record.constructionPermitStatus,
        planningPermitStatus = record.planning,
    )
}
