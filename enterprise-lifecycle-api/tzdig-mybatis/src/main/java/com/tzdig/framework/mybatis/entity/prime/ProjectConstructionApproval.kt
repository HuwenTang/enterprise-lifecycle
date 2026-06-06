@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.time.LocalDate

@Table("project_construction_approval", dataSource = "gong-gai")
//@Table("project_construction_approval")
class ProjectConstructionApproval() : BaseModel<ProjectConstructionApproval>() {
    constructor(init: ProjectConstructionApproval.() -> Unit) : this() {
        this.init()
    }

    /**
     * 项目代码
     */
    @Column("project_code", comment = "项目代码")
    var projectCode: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 项目地址-行政区划
     */
    @Column("administrative_division", comment = "项目地址-行政区划")
    var administrativeDivision: String? = null

    /**
     * 项目详细地址
     */
    @Column("detailed_address", comment = "项目详细地址")
    var detailedAddress: String? = null

    /**
     * 工程代码
     */
    @Column("engineering_code", comment = "工程代码")
    var engineeringCode: String? = null

    /**
     * 立项部门
     */
    @Column("approval_department", comment = "立项部门")
    var approvalDepartment: String? = null

    /**
     * 行业类别（国标行业）
     */
    @Column("industry_category", comment = "行业类别（国标行业）")
    var industryCategory: String? = null

    /**
     * 项目类型
     */
    @Column("project_type", comment = "项目类型")
    var projectType: String? = null

    /**
     * 项目投资来源
     */
    @Column("investment_source", comment = "项目投资来源")
    var investmentSource: String? = null

    /**
     * 立项类型
     */
    @Column("approval_type", comment = "立项类型")
    var approvalType: String? = null

    /**
     * 项目资金属性
     */
    @Column("fund_attribute", comment = "项目资金属性")
    var fundAttribute: String? = null

    /**
     * 总投资额（万元）
     */
    @Column("total_investment", comment = "总投资额（万元）")
    var totalInvestment: String? = null

    /**
     * 项目资本金（万元）
     */
    @Column("project_capital", comment = "项目资本金（万元）")
    var projectCapital: String? = null

    /**
     * 是否是亿元以上产业项目
     */
    @Column("is_over_one_billion_industrial_project", comment = "是否是亿元以上产业项目")
    var isOverOneBillionIndustrialProject: Boolean? = null

    /**
     * 是否是集中建设项目
     */
    @Column("is_concentrated_building_project", comment = "是否是集中建设项目")
    var isConcentratedBuildingProject: Boolean? = null

    /**
     * 集中建设单位名称
     */
    @Column("concentrated_builder_name", comment = "集中建设单位名称")
    var concentratedBuilderName: String? = null

    /**
     * 集中建设单位统一社会信用代码
     */
    @Column("concentrated_builder_uscc", comment = "集中建设单位统一社会信用代码")
    var concentratedBuilderUscc: String? = null

    /**
     * 集中建设单位法定代表人姓名
     */
    @Column("concentrated_builder_legal_representative", comment = "集中建设单位法定代表人姓名")
    var concentratedBuilderLegalRepresentative: String? = null

    /**
     * 单位类型
     */
    @Column("company_type", comment = "单位类型")
    var companyType: String? = null

    /**
     * 企业名称
     */
    @Column("company_name", comment = "企业名称")
    var companyName: String? = null

    /**
     * 统一社会信用代码
     */
    @Column("uscc", comment = "统一社会信用代码")
    var uscc: String? = null

    /**
     * 法定代表人姓名
     */
    @Column("legal_representative", comment = "法定代表人姓名")
    var legalRepresentative: String? = null

    /**
     * 联系电话
     */
    @Column("contact_phone", comment = "联系电话")
    var contactPhone: String? = null

    /**
     * 土地是否带设计方案
     */
    @Column("has_design_plan", comment = "土地是否带设计方案")
    var hasDesignPlan: Boolean? = null

    /**
     * 是否完成区域评估
     */
    @Column("regional_assessment_completed", comment = "是否完成区域评估")
    var regionalAssessmentCompleted: Boolean? = null

    /**
     * 用地面积（㎡）
     */
    @Column("land_area_sqm", comment = "用地面积（㎡）")
    var landAreaSqm: String? = null

    /**
     * 新增用地面积（㎡）
     */
    @Column("new_land_area_sqm", comment = "新增用地面积（㎡）")
    var newLandAreaSqm: String? = null

    /**
     * 土地获取方式
     */
    @Column("land_acquisition_method", comment = "土地获取方式")
    var landAcquisitionMethod: String? = null

    /**
     * 建设性质
     */
    @Column("construction_nature", comment = "建设性质")
    var constructionNature: String? = null

    /**
     * 建设类型
     */
    @Column("construction_type", comment = "建设类型")
    var constructionType: String? = null

    /**
     * 总建筑面积（㎡）
     */
    @Column("total_floor_area_sqm", comment = "总建筑面积（㎡）")
    var totalFloorAreaSqm: String? = null

    /**
     * 拟开工时间
     */
    @Column("planned_start_date", comment = "拟开工时间")
    var plannedStartDate: LocalDate? = null

    /**
     * 拟建成时间
     */
    @Column("planned_completion_date", comment = "拟建成时间")
    var plannedCompletionDate: LocalDate? = null

    /**
     * 经度
     */
    @Column("longitude", comment = "经度")
    var longitude: String? = null

    /**
     * 纬度
     */
    @Column("latitude", comment = "纬度")
    var latitude: String? = null

    /**
     * 建设内容（包括必要性）
     */
    @Column("construction_content", comment = "建设内容（包括必要性）")
    var constructionContent: String? = null

    /**
     * 工改项目所处阶段
     */
    @Column("stage", comment = "工改项目所处阶段")
    var stage: Int? = null
}
