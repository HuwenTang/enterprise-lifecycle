@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelIgnore
import cn.idev.excel.annotation.ExcelProperty
import com.fasterxml.jackson.annotation.JsonFormat
import com.tzdig.framework.mybatis.entity.prime.ProjectConstructionApproval
import com.tzdig.framework.web.annotation.JsonAreaName
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

data class ProjectConstructionApprovalVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "项目代码")
    @ExcelProperty("项目代码")
    val projectCode: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String?,
    @get:Schema(description = "项目地址-行政区划")
    @ExcelProperty("项目地址-行政区划")
    val administrativeDivision: String?,
    @get:Schema(description = "项目地址-行政区划")
    @ExcelProperty("项目地址-行政区划")
    val area: String?,
    @get:Schema(description = "项目详细地址")
    @ExcelProperty("项目详细地址")
    val detailedAddress: String?,
    @get:Schema(description = "工程代码")
    @ExcelProperty("工程代码")
    val engineeringCode: String?,
    @get:Schema(description = "立项部门")
    @ExcelProperty("立项部门")
    val approvalDepartment: String?,
    @get:Schema(description = "行业类别（国标行业）")
    @ExcelIgnore
    val industryCategory: String?,
    @get:Schema(description = "项目类型")
    @ExcelIgnore
    val projectType: String?,
    @get:Schema(description = "项目投资来源")
    @ExcelIgnore
    val investmentSource: String?,
    @get:Schema(description = "立项类型")
    @ExcelIgnore
    val approvalType: String?,
    @get:Schema(description = "项目资金属性")
    @ExcelIgnore
    val fundAttribute: String?,
    @get:Schema(description = "总投资额（万元）")
    @ExcelProperty("总投资额（万元）")
    val totalInvestment: String?,
    @get:Schema(description = "项目资本金（万元）")
    @ExcelProperty("项目资本金（万元）")
    val projectCapital: String?,
    @get:Schema(description = "是否是亿元以上产业项目")
    @ExcelProperty("是否是亿元以上产业项目")
    val isOverOneBillionIndustrialProject: Boolean?,
    @get:Schema(description = "是否是集中建设项目")
    @ExcelProperty("是否是集中建设项目")
    val isConcentratedBuildingProject: Boolean?,
    @get:Schema(description = "集中建设单位名称")
    @ExcelProperty("集中建设单位名称")
    val concentratedBuilderName: String?,
    @get:Schema(description = "集中建设单位统一社会信用代码")
    @ExcelProperty("集中建设单位统一社会信用代码")
    val concentratedBuilderUscc: String?,
    @get:Schema(description = "集中建设单位法定代表人姓名")
    @ExcelProperty("集中建设单位法定代表人姓名")
    val concentratedBuilderLegalRepresentative: String?,
    @get:Schema(description = "单位类型")
    @ExcelIgnore
    val companyType: String?,
    @get:Schema(description = "企业名称")
    @ExcelProperty("企业名称")
    val companyName: String?,
    @get:Schema(description = "统一社会信用代码")
    @ExcelProperty("统一社会信用代码")
    val uscc: String?,
    @get:Schema(description = "法定代表人姓名")
    @ExcelProperty("法定代表人姓名")
    val legalRepresentative: String?,
    @get:Schema(description = "联系电话")
    @ExcelProperty("联系电话")
    val contactPhone: String?,
    @get:Schema(description = "土地是否带设计方案")
    @ExcelProperty("土地是否带设计方案")
    val hasDesignPlan: Boolean?,
    @get:Schema(description = "是否完成区域评估")
    @ExcelProperty("是否完成区域评估")
    val regionalAssessmentCompleted: Boolean?,
    @get:Schema(description = "用地面积（㎡）")
    @ExcelProperty("用地面积（㎡）")
    val landAreaSqm: String?,
    @get:Schema(description = "新增用地面积（㎡）")
    @ExcelProperty("新增用地面积（㎡）")
    val newLandAreaSqm: String?,
    @get:Schema(description = "土地获取方式")
    @ExcelIgnore
    val landAcquisitionMethod: String?,
    @get:Schema(description = "建设性质")
    @ExcelIgnore
    val constructionNature: String?,
    @get:Schema(description = "建设类型")
    @ExcelIgnore
    val constructionType: String?,
    @get:Schema(description = "总建筑面积（㎡）")
    @ExcelProperty("总建筑面积（㎡）")
    val totalFloorAreaSqm: String?,
    @get:Schema(description = "拟开工时间")
    @ExcelProperty("拟开工时间")
    @get:JsonFormat(pattern = "yyyy-MM-dd")
    val plannedStartDate: LocalDate?,
    @get:Schema(description = "拟建成时间")
    @ExcelProperty("拟建成时间")
    @get:JsonFormat(pattern = "yyyy-MM-dd")
    val plannedCompletionDate: LocalDate?,
    @get:Schema(description = "经度")
    @ExcelProperty("经度")
    val longitude: String?,
    @get:Schema(description = "纬度")
    @ExcelProperty("纬度")
    val latitude: String?,
    @get:Schema(description = "建设内容（包括必要性）")
    @ExcelProperty("建设内容（包括必要性）")
    val constructionContent: String?,
    @get:Schema(description = "项目阶段")
    var stage: Int?,
) {
    @get:Schema(description = "行业类别（国标行业）")
    @get:JsonLabel("gg_industry_category")
    @ExcelProperty("行业类别（国标行业）")
    var industryCategoryLabel: String? = null
        get() = industryCategory
        private set

    @get:Schema(description = "项目类型")
    @get:JsonLabel("gg_project_type")
    @ExcelProperty("项目类型")
    var projectTypeLabel: String? = null
        get() = projectType
        private set

    @get:Schema(description = "项目投资来源")
    @get:JsonLabel("gg_investment_source")
    @ExcelProperty("项目投资来源")
    var investmentSourceLabel: String? = null
        get() = investmentSource
        private set

    @get:Schema(description = "立项类型")
    @get:JsonLabel("gg_approval_type")
    @ExcelProperty("立项类型")
    var approvalTypeLabel: String? = null
        get() = approvalType
        private set

    @get:Schema(description = "项目资金属性")
    @get:JsonLabel("gg_fund_attribute")
    @ExcelProperty("项目资金属性")
    var fundAttributeLabel: String? = null
        get() = fundAttribute
        private set

    @get:Schema(description = "单位类型")
    @get:JsonLabel("gg_company_type")
    @ExcelProperty("单位类型")
    var companyTypeLabel: String? = null
        get() = companyType
        private set

    @get:Schema(description = "土地获取方式")
    @get:JsonLabel("gg_land_acquisition_method")
    @ExcelProperty("土地获取方式")
    var landAcquisitionMethodLabel: String? = null
        get() = landAcquisitionMethod
        private set

    @get:Schema(description = "建设性质")
    @get:JsonLabel("gg_construction_nature")
    @ExcelProperty("建设性质")
    var constructionNatureLabel: String? = null
        get() = constructionNature
        private set

    @get:Schema(description = "建设类型")
    @get:JsonLabel("gg_construction_type")
    @ExcelProperty("建设类型")
    var constructionTypeLabel: String? = null
        get() = constructionType
        private set

    @get:Schema(description = "项目地址-行政区划")
    @get:JsonAreaName
    @ExcelProperty("项目地址-行政区划")
    var areaName: String? = null
        get() = area
        private set

    constructor(record: ProjectConstructionApproval) : this(
        id = record.id,
        projectCode = record.projectCode,
        projectName = record.projectName,
        administrativeDivision = record.administrativeDivision,
        area = record.administrativeDivision,
        detailedAddress = record.detailedAddress,
        engineeringCode = record.engineeringCode,
        approvalDepartment = record.approvalDepartment,
        industryCategory = record.industryCategory,
        projectType = record.projectType,
        investmentSource = record.investmentSource,
        approvalType = record.approvalType,
        fundAttribute = record.fundAttribute,
        totalInvestment = record.totalInvestment,
        projectCapital = record.projectCapital,
        isOverOneBillionIndustrialProject = record.isOverOneBillionIndustrialProject,
        isConcentratedBuildingProject = record.isConcentratedBuildingProject,
        concentratedBuilderName = record.concentratedBuilderName,
        concentratedBuilderUscc = record.concentratedBuilderUscc,
        concentratedBuilderLegalRepresentative = record.concentratedBuilderLegalRepresentative,
        companyType = record.companyType,
        companyName = record.companyName,
        uscc = record.uscc,
        legalRepresentative = record.legalRepresentative,
        contactPhone = record.contactPhone,
        hasDesignPlan = record.hasDesignPlan,
        regionalAssessmentCompleted = record.regionalAssessmentCompleted,
        landAreaSqm = record.landAreaSqm,
        newLandAreaSqm = record.newLandAreaSqm,
        landAcquisitionMethod = record.landAcquisitionMethod,
        constructionNature = record.constructionNature,
        constructionType = record.constructionType,
        totalFloorAreaSqm = record.totalFloorAreaSqm,
        plannedStartDate = record.plannedStartDate,
        plannedCompletionDate = record.plannedCompletionDate,
        longitude = record.longitude,
        latitude = record.latitude,
        constructionContent = record.constructionContent,
        stage = record.stage
    )
}
