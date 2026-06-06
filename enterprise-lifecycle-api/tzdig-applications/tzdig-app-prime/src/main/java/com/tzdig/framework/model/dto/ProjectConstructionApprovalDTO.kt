@file:Suppress("unused")

package com.tzdig.framework.model.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApproval
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

data class ProjectConstructionApprovalDTO(
    @Schema(description = "项目代码")
    val projectCode: String?,
    @Schema(description = "项目名称")
    val projectName: String?,
    @Schema(description = "项目地址-行政区划")
    val administrativeDivision: String?,
    @Schema(description = "项目详细地址")
    val detailedAddress: String?,
    @Schema(description = "工程代码")
    val engineeringCode: String?,
    @Schema(description = "立项部门")
    val approvalDepartment: String?,
    @Schema(description = "行业类别（国标行业）")
    val industryCategory: String?,
    @Schema(description = "项目类型")
    val projectType: String?,
    @Schema(description = "项目投资来源")
    val investmentSource: String?,
    @Schema(description = "立项类型")
    val approvalType: String?,
    @Schema(description = "项目资金属性")
    val fundAttribute: String?,
    @Schema(description = "总投资额（万元）")
    val totalInvestment: String?,
    @Schema(description = "项目资本金（万元）")
    val projectCapital: String?,
    @Schema(description = "是否是亿元以上产业项目")
    val isOverOneBillionIndustrialProject: Boolean?,
    @Schema(description = "是否是集中建设项目")
    val isConcentratedBuildingProject: Boolean?,
    @Schema(description = "集中建设单位名称")
    val concentratedBuilderName: String?,
    @Schema(description = "集中建设单位统一社会信用代码")
    val concentratedBuilderUscc: String?,
    @Schema(description = "集中建设单位法定代表人姓名")
    val concentratedBuilderLegalRepresentative: String?,
    @Schema(description = "单位类型")
    val companyType: String?,
    @Schema(description = "企业名称")
    val companyName: String?,
    @Schema(description = "统一社会信用代码")
    val uscc: String?,
    @Schema(description = "法定代表人姓名")
    val legalRepresentative: String?,
    @Schema(description = "联系电话")
    val contactPhone: String?,
    @Schema(description = "土地是否带设计方案")
    val hasDesignPlan: Boolean?,
    @Schema(description = "是否完成区域评估")
    val regionalAssessmentCompleted: Boolean?,
    @Schema(description = "用地面积（㎡）")
    val landAreaSqm: String?,
    @Schema(description = "新增用地面积（㎡）")
    val newLandAreaSqm: String?,
    @Schema(description = "土地获取方式")
    val landAcquisitionMethod: String?,
    @Schema(description = "建设性质")
    val constructionNature: String?,
    @Schema(description = "建设类型")
    val constructionType: String?,
    @Schema(description = "总建筑面积（㎡）")
    val totalFloorAreaSqm: String?,
    @Schema(description = "拟开工时间")
    @JsonFormat(pattern = "yyyy-MM-dd")
    val plannedStartDate: LocalDate?,
    @Schema(description = "拟建成时间")
    @JsonFormat(pattern = "yyyy-MM-dd")
    val plannedCompletionDate: LocalDate?,
    @Schema(description = "经度")
    val longitude: String?,
    @Schema(description = "纬度")
    val latitude: String?,
    @Schema(description = "建设内容（包括必要性）")
    val constructionContent: String?,
) {
    fun toProjectConstructionApproval(): ProjectConstructionApproval =
        ProjectConstructionApproval {
            into(this)
        }

    fun into(record: ProjectConstructionApproval): ProjectConstructionApproval {
        record.projectCode = projectCode
        record.projectName = projectName
        record.administrativeDivision = administrativeDivision
        record.detailedAddress = detailedAddress
        record.engineeringCode = engineeringCode
        record.approvalDepartment = approvalDepartment
        record.industryCategory = industryCategory
        record.projectType = projectType
        record.investmentSource = investmentSource
        record.approvalType = approvalType
        record.fundAttribute = fundAttribute
        record.totalInvestment = totalInvestment
        record.projectCapital = projectCapital
        record.isOverOneBillionIndustrialProject = isOverOneBillionIndustrialProject
        record.isConcentratedBuildingProject = isConcentratedBuildingProject
        record.concentratedBuilderName = concentratedBuilderName
        record.concentratedBuilderUscc = concentratedBuilderUscc
        record.concentratedBuilderLegalRepresentative = concentratedBuilderLegalRepresentative
        record.companyType = companyType
        record.companyName = companyName
        record.uscc = uscc
        record.legalRepresentative = legalRepresentative
        record.contactPhone = contactPhone
        record.hasDesignPlan = hasDesignPlan
        record.regionalAssessmentCompleted = regionalAssessmentCompleted
        record.landAreaSqm = landAreaSqm
        record.newLandAreaSqm = newLandAreaSqm
        record.landAcquisitionMethod = landAcquisitionMethod
        record.constructionNature = constructionNature
        record.constructionType = constructionType
        record.totalFloorAreaSqm = totalFloorAreaSqm
        record.plannedStartDate = plannedStartDate
        record.plannedCompletionDate = plannedCompletionDate
        record.longitude = longitude
        record.latitude = latitude
        record.constructionContent = constructionContent
        return record
    }
}
