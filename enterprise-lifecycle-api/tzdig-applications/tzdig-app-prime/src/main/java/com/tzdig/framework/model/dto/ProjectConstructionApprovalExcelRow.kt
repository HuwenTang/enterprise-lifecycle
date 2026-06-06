@file:Suppress("unused")

package com.tzdig.framework.model.dto

import cn.idev.excel.annotation.ExcelProperty
import cn.idev.excel.annotation.write.style.HeadFontStyle
import cn.idev.excel.annotation.write.style.HeadRowHeight
import com.tzdig.framework.core.annotation.processor.ExcelRow
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApproval
import java.time.LocalDate

@HeadRowHeight(20)
@HeadFontStyle(fontHeightInPoints = 11)
data class ProjectConstructionApprovalExcelRow(
    @ExcelProperty("项目代码")
    var projectCode: String? = null,
    @ExcelProperty("项目名称")
    var projectName: String? = null,
    @ExcelProperty("项目地址-行政区划")
    var administrativeDivision: String? = null,
    @ExcelProperty("项目详细地址")
    var detailedAddress: String? = null,
    @ExcelProperty("工程代码")
    var engineeringCode: String? = null,
    @ExcelProperty("立项部门")
    var approvalDepartment: String? = null,
    @ExcelProperty("行业类别（国标行业）")
    var industryCategory: String? = null,
    @ExcelProperty("项目类型")
    var projectType: String? = null,
    @ExcelProperty("项目投资来源")
    var investmentSource: String? = null,
    @ExcelProperty("立项类型")
    var approvalType: String? = null,
    @ExcelProperty("项目资金属性")
    var fundAttribute: String? = null,
    @ExcelProperty("总投资额（万元）")
    var totalInvestment: String? = null,
    @ExcelProperty("项目资本金（万元）")
    var projectCapital: String? = null,
    @ExcelProperty("是否是亿元以上产业项目")
    var isOverOneBillionIndustrialProject: Boolean? = null,
    @ExcelProperty("是否是集中建设项目")
    var isConcentratedBuildingProject: Boolean? = null,
    @ExcelProperty("集中建设单位名称")
    var concentratedBuilderName: String? = null,
    @ExcelProperty("集中建设单位统一社会信用代码")
    var concentratedBuilderUscc: String? = null,
    @ExcelProperty("集中建设单位法定代表人姓名")
    var concentratedBuilderLegalRepresentative: String? = null,
    @ExcelProperty("单位类型")
    var companyType: String? = null,
    @ExcelProperty("企业名称")
    var companyName: String? = null,
    @ExcelProperty("统一社会信用代码")
    var uscc: String? = null,
    @ExcelProperty("法定代表人姓名")
    var legalRepresentative: String? = null,
    @ExcelProperty("联系电话")
    var contactPhone: String? = null,
    @ExcelProperty("土地是否带设计方案")
    var hasDesignPlan: Boolean? = null,
    @ExcelProperty("是否完成区域评估")
    var regionalAssessmentCompleted: Boolean? = null,
    @ExcelProperty("用地面积（㎡）")
    var landAreaSqm: String? = null,
    @ExcelProperty("新增用地面积（㎡）")
    var newLandAreaSqm: String? = null,
    @ExcelProperty("土地获取方式")
    var landAcquisitionMethod: String? = null,
    @ExcelProperty("建设性质")
    var constructionNature: String? = null,
    @ExcelProperty("建设类型")
    var constructionType: String? = null,
    @ExcelProperty("总建筑面积（㎡）")
    var totalFloorAreaSqm: String? = null,
    @ExcelProperty("拟开工时间")
    var plannedStartDate: LocalDate? = null,
    @ExcelProperty("拟建成时间")
    var plannedCompletionDate: LocalDate? = null,
    @ExcelProperty("经度")
    var longitude: String? = null,
    @ExcelProperty("纬度")
    var latitude: String? = null,
    @ExcelProperty("建设内容（包括必要性）")
    var constructionContent: String? = null,
) : ExcelRow<ProjectConstructionApprovalExcelRow>() {
    fun toProjectConstructionApproval(): ProjectConstructionApproval =
        with(ProjectConstructionApproval()) {
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
