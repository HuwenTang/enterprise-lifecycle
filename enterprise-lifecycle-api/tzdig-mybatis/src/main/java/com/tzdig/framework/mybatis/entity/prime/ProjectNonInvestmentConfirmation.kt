@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

@Table("project_non_investment_confirmation", comment = "")
class ProjectNonInvestmentConfirmation() : BaseModel<ProjectNonInvestmentConfirmation>() {
    constructor(init: ProjectNonInvestmentConfirmation.() -> Unit) : this() {
        this.init()
    }

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 项目代码
     */
    @Column("project_code", comment = "项目代码")
    var projectCode: String? = null

    /**
     *  市（区）
     */
    @Column("city_district", comment = " 市（区）")
    var cityDistrict: String? = null

    /**
     * 园区（镇街）
     */
    @Column("park", comment = "园区（镇街）")
    var park: String? = null

    /**
     * 项目状态
     */
    @Column("progress", comment = "项目状态")
    var progress: ProjectDigitalInvestmentAttracting.ProjectProgress? = null

    /**
     * 项目地址
     */
    @Column("project_address", comment = "项目地址")
    var projectAddress: String? = null

    /**
     * 批准部门
     */
    @Column("approval_department", comment = "批准部门")
    var approvalDepartment: String? = null

    /**
     * 备案证号
     */
    @Column("record_number", comment = "备案证号")
    var recordNumber: String? = null

    /**
     * 批准日期
     */
    @Column("approval_date", comment = "批准日期")
    var approvalDate: LocalDate? = null

    /**
     * 申请备案时间
     */
    @Column("application_time", comment = "申请备案时间")
    var applicationTime: LocalDateTime? = null

    /**
     * 投资类型
     */
    @Column("investment_type", comment = "投资类型")
    var investmentType: String? = null

    /**
     * 投资方名称
     */
    @Column("investor", comment = "投资方名称")
    var investor: String? = null

    /**
     * 项目投资额(万元)
     */
    @Column("investment_amount", comment = "项目投资额(万元)")
    var investmentAmount: BigDecimal? = null

    /**
     * 是否外资项目
     */
    @Column("is_foreign_capital", comment = "是否外资项目")
    var isForeignCapital: Boolean? = null

    /**
     * 申报单位
     */
    @Column("department", comment = "申报单位")
    var department: String? = null

    /**
     * 项目类型
     */
    @Column("project_type", comment = "项目类型")
    var projectType: String? = null

    /**
     * 产业方向
     */
    @Column("industry_direction", comment = "产业方向")
    var industryDirection: String? = null

    /**
     * 行业代码
     */
    @Column("industry_code", comment = "行业代码")
    var industryCode: String? = null

    /**
     * 行业分类
     */
    @Column("industry_classification", comment = "行业分类")
    var industryClassification: String? = null

    /**
     * 固定资产投资（万元）
     */
    @Column("fixed_asset_investment", comment = "固定资产投资（万元）")
    var fixedAssetInvestment: BigDecimal? = null

    /**
     * 统一社会信用代码
     */
    @Column("unified_social_credit_code", comment = "统一社会信用代码")
    var unifiedSocialCreditCode: String? = null

    /**
     * 主要产品、产能及主要建设内容
     */
    @Column("main_products", comment = "主要产品、产能及主要建设内容")
    var mainProducts: String? = null

    /**
     * 用地类型
     */
    @Column("land_use_type", comment = "用地类型")
    var landUseType: String? = null

    /**
     * 供地进度
     */
    @Column("land_supply_progress", comment = "供地进度")
    var landSupplyProgress: String? = null

    /**
     * 环评进展
     */
    @Column("environmental_assessment", comment = "环评进展")
    var environmentalAssessment: String? = null

    /**
     * 安评情况
     */
    @Column("safety_assessment", comment = "安评情况")
    var safetyAssessment: String? = null

    /**
     * 能评情况
     */
    @Column("energy_assessment", comment = "能评情况")
    var energyAssessment: String? = null

    /**
     * 施工图审查情况
     */
    @Column("construction_drawing_review", comment = "施工图审查情况")
    var constructionDrawingReview: String? = null

    /**
     * 施工许可情况
     */
    @Column("construction_permit_status", comment = "施工许可情况")
    var constructionPermitStatus: String? = null

    /**
     * 备注
     */
    @Column("remarks", comment = "备注")
    var remarks: String? = null

    /**
     * 开工日期
     */
    @Column("commencement_date", comment = "开工日期")
    var commencementDate: LocalDate? = null

    /**
     * 项目开工相关佐证资料
     */
    @Column("kgzzcl", comment = "项目开工相关佐证资料")
    var kgzzcl: String? = null

    /**
     * 项目进展图片
     */
    @Column("progress_images", comment = "项目进展图片")
    var progressImages: String? = null

    /**
     * 是否已入库纳统
     */
    @Column("is_included_in_database", comment = "是否已入库纳统")
    var isIncludedInDatabase: Boolean? = null

    /**
     * 竣工日期
     */
    @Column("end_date", comment = "竣工日期")
    var endDate: LocalDate? = null

    /**
     * 项目竣工相关佐证资料
     */
    @Column("jgzzcl", comment = "项目竣工相关佐证资料")
    var jgzzcl: String? = null

    /**
     * 是否在线审批项目
     */
    @Column("is_online_approval", comment = "是否在线审批项目")
    var isOnlineApproval: Boolean? = null

    /**
     * 项目是否列统
     */
    @Column("is_lt", comment = "项目是否列统 ")
    var isLt: Boolean? = null

    /**
     * 统计编码
     */
    @Column("lt_code", comment = "统计编码")
    var ltCode: String? = null

    //rk_stat int null comment '入库状态（0审核中、1已入库、2已退回）'
    @Column("rk_stat", comment = "入库状态（0审核中、1已入库、2已退回）")
    var rkStat: Int? = null

    /**
     * 创建人
     */
    @Column("creator", comment = "创建人")
    var creator: String? = null

    /**
     * 状态1、草稿2、正文
     */
    @Column("status", comment = "状态1、草稿2、正文")
    var status: Int? = null

    @Column("comments", comment = "审核意见")
    var comments: String? = null
}
