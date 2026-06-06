@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

@Table("project_filing_info", comment = "项目备案信息表")
class ProjectFilingInfo() : BaseModel<ProjectFilingInfo>() {
    constructor(init: ProjectFilingInfo.() -> Unit) : this() {
        this.init()
    }

    /**
     * 市（区），如：靖江市、泰兴市等
     */
    @Column("district", comment = "市（区），如：靖江市、泰兴市等")
    var district: String? = null

    /**
     * park
     */
    @Column("park", comment = "park")
    var park: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 备案时的项目名称
     */
    @Column("filing_project_name", comment = "备案时的项目名称")
    var filingProjectName: String? = null

    /**
     * 申报单位
     */
    @Column("application_unit", comment = "申报单位")
    var applicationUnit: String? = null

    /**
     * 项目投资额 (万元)
     */
    @Column("investment_amount", comment = "项目投资额 (万元)")
    var investmentAmount: BigDecimal? = null

    /**
     * 项目代码
     */
    @Column("project_code", comment = "项目代码")
    var projectCode: String? = null

    /**
     * 建设规模
     */
    @Column("construction_scale", comment = "建设规模")
    var constructionScale: String? = null

    /**
     * 备案证号
     */
    @Column("filing_certificate_no", comment = "备案证号")
    var filingCertificateNo: String? = null

    /**
     * 申请备案时间
     */
    @Column("apply_filing_time", comment = "申请备案时间")
    var applyFilingTime: LocalDateTime? = null

    /**
     * 完成备案时间
     */
    @Column("complete_filing_time", comment = "完成备案时间")
    var completeFilingTime: LocalDate? = null

    /**
     * 是否外资项目 (0:否, 1:是)
     */
    @Column("is_foreign_investment", comment = "是否外资项目 (0:否, 1:是)")
    var isForeignInvestment: Boolean? = null

    /**
     * 法人单位信息
     */
    @Column("legal_entity_info", comment = "法人单位信息")
    var legalEntityInfo: String? = null

    /**
     * 备案部门
     */
    @Column("filing_department", comment = "备案部门")
    var filingDepartment: String? = null

    /**
     * 项目类型（工业、服务业）
     */
    @Column("project_type", comment = "项目类型（工业、服务业）")
    var projectType: String? = null

    /**
     * 产业方向（工业项目选“8+13+X”类别或“其他”）
     */
    @Column("industry_direction", comment = "产业方向（工业项目选“8+13+X”类别或“其他”）")
    var industryDirection: String? = null

    /**
     * 8个创新集群
     */
    @Column("innovative_cluster", comment = "8个创新集群")
    var innovativeCluster: String? = null

    /**
     * 13条产业链
     */
    @Column("industrial_chain", comment = "13条产业链")
    var industrialChain: String? = null

    /**
     * 用地类型
     */
    @Column("land_use_type", comment = "用地类型")
    var landUseType: String? = null

    /**
     * 供地进展（新增用地项目填写）
     */
    @Column("land_supply_progress", comment = "供地进展（新增用地项目填写）")
    var landSupplyProgress: String? = null

    /**
     * 环评进展
     */
    @Column("environmental_assessment_status", comment = "环评进展")
    var environmentalAssessmentStatus: String? = null

    /**
     * 安评情况
     */
    @Column("safety_assessment_status", comment = "安评情况")
    var safetyAssessmentStatus: String? = null

    /**
     * 能评情况
     */
    @Column("energy_assessment_status", comment = "能评情况")
    var energyAssessmentStatus: String? = null

    /**
     * 施工图审查情况
     */
    @Column("construction_drawing_review_status", comment = "施工图审查情况")
    var constructionDrawingReviewStatus: String? = null

    /**
     * 施工许可情况
     */
    @Column("construction_permit_status", comment = "施工许可情况")
    var constructionPermitStatus: String? = null

    /**
     * 规划许可
     */
    @Column("planning", comment = "规划许可")
    var planning: String? = null
}
