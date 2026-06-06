@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectFilingInfo
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectFilingInfoExcelRow(
    @field:ExcelProperty("市（区），如：靖江市、泰兴市等")
    var district: String? = null,
    @field:ExcelProperty("park")
    var park: String? = null,
    @field:ExcelProperty("项目名称")
    var projectName: String? = null,
    @field:ExcelProperty("备案时的项目名称")
    var filingProjectName: String? = null,
    @field:ExcelProperty("申报单位")
    var applicationUnit: String? = null,
    @field:ExcelProperty("项目投资额 (万元)")
    var investmentAmount: BigDecimal? = null,
    @field:ExcelProperty("项目代码")
    var projectCode: String? = null,
    @field:ExcelProperty("建设规模")
    var constructionScale: String? = null,
    @field:ExcelProperty("备案证号")
    var filingCertificateNo: String? = null,
    @field:ExcelProperty("申请备案时间")
    var applyFilingTime: LocalDateTime? = null,
    @field:ExcelProperty("完成备案时间")
    var completeFilingTime: LocalDate? = null,
    @field:ExcelProperty("是否外资项目 (0:否, 1:是)")
    var isForeignInvestment: Boolean? = null,
    @field:ExcelProperty("法人单位信息")
    var legalEntityInfo: String? = null,
    @field:ExcelProperty("备案部门")
    var filingDepartment: String? = null,
    @field:ExcelProperty("项目类型（工业、服务业）")
    var projectType: String? = null,
    @field:ExcelProperty("产业方向（工业项目选“8+13+X”类别或“其他”）")
    var industryDirection: String? = null,
    @field:ExcelProperty("用地类型")
    var landUseType: String? = null,
    @field:ExcelProperty("供地进展（新增用地项目填写）")
    var landSupplyProgress: String? = null,
    @field:ExcelProperty("环评进展")
    var environmentalAssessmentStatus: String? = null,
    @field:ExcelProperty("安评情况")
    var safetyAssessmentStatus: String? = null,
    @field:ExcelProperty("能评情况")
    var energyAssessmentStatus: String? = null,
    @field:ExcelProperty("施工图审查情况")
    var constructionDrawingReviewStatus: String? = null,
    @field:ExcelProperty("施工许可情况")
    var constructionPermitStatus: String? = null,
) : ExcelRow<ProjectFilingInfoExcelRow>() {
    fun toProjectFilingInfo(): ProjectFilingInfo =
        ProjectFilingInfo {
            into(this)
        }

    fun into(record: ProjectFilingInfo): ProjectFilingInfo {
        record.district = district
        record.park = park
        record.projectName = projectName
        record.filingProjectName = filingProjectName
        record.applicationUnit = applicationUnit
        record.investmentAmount = investmentAmount
        record.projectCode = projectCode
        record.constructionScale = constructionScale
        record.filingCertificateNo = filingCertificateNo
        record.applyFilingTime = applyFilingTime
        record.completeFilingTime = completeFilingTime
        record.isForeignInvestment = isForeignInvestment
        record.legalEntityInfo = legalEntityInfo
        record.filingDepartment = filingDepartment
        record.projectType = projectType
        record.industryDirection = industryDirection
        record.landUseType = landUseType
        record.landSupplyProgress = landSupplyProgress
        record.environmentalAssessmentStatus = environmentalAssessmentStatus
        record.safetyAssessmentStatus = safetyAssessmentStatus
        record.energyAssessmentStatus = energyAssessmentStatus
        record.constructionDrawingReviewStatus = constructionDrawingReviewStatus
        record.constructionPermitStatus = constructionPermitStatus
        return record
    }
}
