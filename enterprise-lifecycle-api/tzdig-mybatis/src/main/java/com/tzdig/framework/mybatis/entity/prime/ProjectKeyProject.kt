@file:Suppress("unused")

package com.tzdig.framework.mybatis.entity.prime

import com.mybatisflex.annotation.Column
import com.mybatisflex.annotation.Table
import com.tzdig.framework.mybatis.base.BaseModel
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

@Table("project_key_project", comment = "重点项目信息表")
class ProjectKeyProject() : BaseModel<ProjectKeyProject>() {
    constructor(init: ProjectKeyProject.() -> Unit) : this() {
        this.init()
    }

    /**
     * 项目ID（在线平台项目代码）
     */
    @Column("digital_investment_id", comment = "项目ID（在线平台项目代码）")
    var digitalInvestmentId: String? = null

    /**
     * 项目名称
     */
    @Column("project_name", comment = "项目名称")
    var projectName: String? = null

    /**
     * 所属区县
     */
    @Column("district", comment = "所属区县")
    var district: String? = null

    /**
     * 所属园区
     */
    @Column("park", comment = "所属园区")
    var park: String? = null

    /**
     * 产业类别（工业/服务业）
     */
    @Column("industry_category", comment = "产业类别（工业/服务业）")
    var industryCategory: String? = null

    /**
     * 8+13+x
     */
    @Column("8_13_x", comment = "8+13+x")
    var x: String? = null

    /**
     * 计划总投资类型（外资/内资）
     */
    @Column("investment_type", comment = "计划总投资类型（外资/内资）")
    var investmentType: String? = null

    /**
     * 计划总投资金额
     */
    @Column("total_investment_amount", comment = "计划总投资金额")
    var totalInvestmentAmount: BigDecimal? = null

    /**
     * 是否分期 (0:否, 1:是)
     */
    @Column("is_phased", comment = "是否分期 (0:否, 1:是)")
    var ifPhased: Boolean? = null

    /**
     * 本期金额（万元）
     */
    @Column("current_amount", comment = "本期金额（万元）")
    var currentAmount: BigDecimal? = null

    /**
     * 建设内容及规模
     */
    @Column("construction_content", comment = "建设内容及规模")
    var constructionContent: String? = null

    /**
     * 主要产品及产能
     */
    @Column("main_products_capacity", comment = "主要产品及产能")
    var mainProductsCapacity: String? = null

    /**
     * 预期产值(万元)
     */
    @Column("expect_output", comment = "预期产值(万元)")
    var expectOutput: BigDecimal? = null

    /**
     * 用工（人）
     */
    @Column("worker", comment = "用工（人）")
    var worker: Int? = null

    /**
     * 亩均税收
     */
    @Column("revenue_per_mu", comment = "亩均税收")
    var revenuePerMu: BigDecimal? = null

    /**
     * 建设起始年限-开工年份
     */
    @Column("start_year", comment = "建设起始年限-开工年份")
    var startYear: Int? = null

    /**
     * 建设起止年限-竣工年份
     */
    @Column("end_year", comment = "建设起止年限-竣工年份")
    var endYear: Int? = null

    /**
     * 年度计划投资（万元）
     */
    @Column("annual_plan_investment", comment = "年度计划投资（万元）")
    var annualPlanInvestment: BigDecimal? = null

    /**
     * 年度形象进度
     */
    @Column("annual_image_progress", comment = "年度形象进度")
    var annualImageProgress: String? = null

    /**
     * 项目类型
     */
    @Column("project_type", comment = "项目类型")
    var projectType: String? = null

    /**
     * 投资主体名称
     */
    @Column("investor_name", comment = "投资主体名称")
    var investorName: String? = null

    /**
     * 统一信用代码
     */
    @Column("credit_code", comment = "统一信用代码")
    var creditCode: String? = null

    /**
     * 投资主体性质 (多选)
     */
    @Column("investor_nature", comment = "投资主体性质 (多选)")
    var investorNature: String? = null

    /**
     * 投资主体简介
     */
    @Column("investor_intro", comment = "投资主体简介")
    var investorIntro: String? = null

    /**
     * 行业代码
     */
    @Column("industry_code", comment = "行业代码")
    var industryCode: String? = null

    /**
     * 研发平台
     */
    @Column("rd_platform", comment = "研发平台")
    var rdPlatform: String? = null

    /**
     * 近三年平均研发投入占比 (%)
     */
    @Column("rd_ratio_avg_3y", comment = "近三年平均研发投入占比 (%)")
    var rdRatioAvg3y: BigDecimal? = null

    /**
     * 发明专利（件）
     */
    @Column("invention_patents", comment = "发明专利（件）")
    var inventionPatents: Int? = null

    /**
     * 实用新型或外观专利（件）
     */
    @Column("utility_patents", comment = "实用新型或外观专利（件）")
    var utilityPatents: Int? = null

    /**
     * 用地类型 (新增用地/存量厂房)
     */
    @Column("land_type", comment = "用地类型 (新增用地/存量厂房)")
    var landType: String? = null

    /**
     * 用地面积(亩
     */
    @Column("land_area", comment = "用地面积(亩")
    var landArea: BigDecimal? = null

    /**
     * 用地手续办理情况
     */
    @Column("land_situation", comment = "用地手续办理情况")
    var landSituation: String? = null

    /**
     * 土地情况-基本农田
     */
    @Column("is_basic_farmland", comment = "土地情况-基本农田")
    var isBasicFarmland: Boolean? = null

    /**
     * 土地情况-生态红线
     */
    @Column("is_ecological_boundary", comment = "土地情况-生态红线")
    var isEcologicalBoundary: Boolean? = null

    /**
     * 用地手续办理情况
     */
    @Column("land_use_procedures", comment = "用地手续办理情况")
    var landUseProcedures: String? = null

    /**
     * 是否为&quot;两高&quot;项目 (0:否, 1:是)
     */
    @Column("is_two_high", comment = "是否为&quot;两高&quot;项目 (0:否, 1:是)")
    var ifTwoHigh: Boolean? = null

    /**
     * 是否完成节能审查 (0:否, 1:是)
     */
    @Column("energy_review_done", comment = "是否完成节能审查 (0:否, 1:是)")
    var energyReviewDone: Boolean? = null

    /**
     * 能评佐证材料
     */
    @Column("energy_zzcl", comment = "能评佐证材料")
    var energyZzcl: String? = null

    /**
     * 是否完成环评 (0:否, 1:是)
     */
    @Column("env_assessment_done", comment = "是否完成环评 (0:否, 1:是)")
    var envAssessmentDone: Boolean? = null

    /**
     * 项目环境影响情况
     */
    @Column("env_situ", comment = "项目环境影响情况")
    var envSitu: String? = null

    /**
     * 环评佐证材料
     */
    @Column("environment_zzcl", comment = "环评佐证材料")
    var environmentZzcl: String? = null

    /**
     * 是否备案 (0:否, 1:是)
     */
    @Column("is_filed", comment = "是否备案 (0:否, 1:是)")
    var ifFiled: Boolean? = null

    /**
     * 备案佐证材料
     */
    @Column("filed_zzcl", comment = "备案佐证材料")
    var filedZzcl: String? = null

    /**
     * 是否取得安评批复 (0:否, 1:是)
     */
    @Column("safety_approval_done", comment = "是否取得安评批复 (0:否, 1:是)")
    var safetyApprovalDone: Boolean? = null

    /**
     * 安评佐证材料
     */
    @Column("safety_zzcl", comment = "安评佐证材料")
    var safetyZzcl: String? = null

    /**
     * 项目特色亮点
     */
    @Column("highlights", comment = "项目特色亮点")
    var highlights: String? = null

    /**
     * 项目评估状态
     */
    @Column("project_evaluation_status", comment = "项目评估状态")
    var projectEvaluationStatus: String? = null

    /**
     * 计划开工时间
     */
    @Column("plan_start_date", comment = "计划开工时间")
    var planStartDate: LocalDate? = null

    /**
     * 入库时间
     */
    @Column("storage_in_time", comment = "入库时间")
    var storageInTime: LocalDateTime? = null

    /**
     * 出库时间
     */
    @Column("storage_out_time", comment = "出库时间")
    var storageOutTime: LocalDateTime? = null

    /**
     * 所属年度
     */
    @Column("belong_year", comment = "所属年度")
    var belongYear: Int? = null

    /**
     * 是否市重点
     */
    @Column("is_city_key", comment = "是否市重点")
    var ifCityKey: Boolean? = null

    /**
     * 是否省重点
     */
    @Column("is_province_key", comment = "是否省重点")
    var ifProvinceKey: Boolean? = null

    /**
     * 项目来源
     */
    @Column("project_source", comment = "项目来源")
    var projectSource: String? = null

    /**
     * 发改项目名称
     */
    @Column("fg_name", comment = "发改项目名称")
    var fgName: String? = null

    /**
     * 是否2026年新开工
     */
    @Column("is_new_start_2026", comment = "是否2026年新开工")
    var ifNewStart2026: Boolean? = null

    /**
     * 是否开工项目
     */
    @Column("is_start", comment = "是否开工项目")
    var ifStart: Boolean? = null

    /**
     * 是否统计入库
     */
    @Column("is_storage", comment = "是否统计入库")
    var ifStorage: Boolean? = null

    /**
     * 累计列统投资
     */
    @Column("in_invest", comment = "累计列统投资")
    var inInvest: Double? = null

    /**
     * 列统投资完成率
     */
    @Column("investment_completion_rate", comment = "列统投资完成率")
    var investmentCompletionRate: Double? = null

    /**
     * 统计代码
     */
    @Column("in_invest_code", comment = "统计代码")
    var inInvestCode: String? = null

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
}
