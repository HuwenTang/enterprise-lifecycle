@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.tzdig.framework.mybatis.entity.prime.ProjectFilingInfo
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class ProjectFilingInfoDTO(
    @param:Schema(description = "市（区），如：靖江市、泰兴市等")
    val district: String?,
    @param:Schema(description = "park")
    val park: String?,
    @param:Schema(description = "项目名称")
    val projectName: String?,
    @param:Schema(description = "备案时的项目名称")
    val filingProjectName: String?,
    @param:Schema(description = "申报单位")
    val applicationUnit: String?,
    @param:Schema(description = "项目投资额 (万元)")
    val investmentAmount: BigDecimal?,
    @param:Schema(description = "项目代码")
    val projectCode: String?,
    @param:Schema(description = "建设规模")
    val constructionScale: String?,
    @param:Schema(description = "备案证号")
    val filingCertificateNo: String?,
    @param:Schema(description = "申请备案时间")
    val applyFilingTime: LocalDateTime?,
    @param:Schema(description = "完成备案时间")
    val completeFilingTime: LocalDate?,
    @param:Schema(description = "是否外资项目 (0:否, 1:是)")
    val isForeignInvestment: Boolean?,
    @param:Schema(description = "法人单位信息")
    val legalEntityInfo: String?,
    @param:Schema(description = "备案部门")
    val filingDepartment: String?,
    @param:Schema(description = "项目类型（工业、服务业）")
    val projectType: String?,
    @param:Schema(description = "产业方向（工业项目选“8+13+X”类别或“其他”）")
    val industryDirection: String?,
    @param:Schema(description = "用地类型")
    val landUseType: String?,
    @param:Schema(description = "供地进展（新增用地项目填写）")
    val landSupplyProgress: String?,
    @param:Schema(description = "环评进展")
    val environmentalAssessmentStatus: String?,
    @param:Schema(description = "安评情况")
    val safetyAssessmentStatus: String?,
    @param:Schema(description = "能评情况")
    val energyAssessmentStatus: String?,
    @param:Schema(description = "施工图审查情况")
    val constructionDrawingReviewStatus: String?,
    @param:Schema(description = "施工许可情况")
    val constructionPermitStatus: String?,
) {
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
