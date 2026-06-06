@file:Suppress("unused")

package com.tzdig.framework.model.vo

import cn.idev.excel.annotation.ExcelIgnore
import cn.idev.excel.annotation.ExcelProperty
import com.tzdig.framework.core.annotation.JsonDecimal
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.web.annotation.JsonLabel
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate
import java.time.LocalDateTime

data class ProjectDigitalInvestmentAttractingVO(
    @get:Schema(description = "主键")
    @ExcelProperty("主键")
    val id: String?,
    @get:Schema(description = "项目编号")
    @ExcelProperty("项目编号")
    val projectCode: String?,
    @get:Schema(description = "项目名称")
    @ExcelProperty("项目名称")
    val projectName: String?,
    @get:Schema(description = "所属区县")
    @ExcelProperty("所属区县")
    val district: String?,
    @get:Schema(description = "所属区县")
    @ExcelProperty("所属区县")
    var districtName: String?,
    @get:Schema(description = "所属园区")
    @ExcelProperty("所属园区")
    val park: String?,
    @get:Schema(description = "签约核定审核状态")
    @ExcelProperty("签约核定审核状态")
    val auditStatusqy: Int?,
    @get:Schema(description = "开工审核状态")
    @ExcelProperty("开工审核状态")
    val auditStatusKaigong: Int?,
    @get:Schema(description = "所属园区")
    @ExcelProperty("所属园区")
    var parkName: String?,
    @get:Schema(description = "国民经济分类")
    @ExcelProperty("国民经济分类")
    val nationalEconomicClassification: String?,
    @get:Schema(description = "统一社会信用代码")
    @ExcelProperty("统一社会信用代码")
    val uscc: String?,
    @get:Schema(description = "企业名称")
    @ExcelProperty("企业名称")
    val companyName: String?,
    @get:Schema(description = "企业注册资金")
    @ExcelProperty("企业注册资金")
    val companyRegistrationFunds: Double?,
    @get:Schema(description = "企业注册日期")
    @ExcelProperty("企业注册日期")
    val companyRegistrationDate: LocalDate?,
    @get:Schema(description = "项目类别")
    @ExcelProperty("项目类别")
    val projectCategory: String?,
    @get:Schema(description = "项目属性")
    @ExcelProperty("项目属性")
    val projectAttribute: String?,
    @get:Schema(description = "项目内容")
    @ExcelProperty("项目内容")
    val projectContent: String?,
    @get:Schema(description = "投资标识")
    @ExcelIgnore
    val investmentFlag: String?,
    @get:Schema(description = "国别/地区")
    @ExcelProperty("国别/地区")
    val countryRegion: String?,
    @get:Schema(description = "具体国别/地区")
    @ExcelProperty("具体国别/地区")
    val specificCountryRegion: String?,
    @get:Schema(description = "投资方")
    @ExcelProperty("投资方")
    val investor: String?,
    @get:Schema(description = "投资金额（亿美元/亿元）")
    @ExcelProperty("投资金额（亿美元/亿元）")
    val investmentAmount: Double?,
    @get:Schema(description = "注册资本（亿美元/亿元）")
    @ExcelProperty("注册资本（亿美元/亿元）")
    val registeredCapital: String?,
    @get:Schema(description = "洽谈进度")
    @ExcelProperty("洽谈进度")
    val negotiationProgress: String?,
    @get:Schema(description = "产业大类名称")
    @ExcelProperty("产业大类名称")
    val industryClassification: String?,
    @get:Schema(description = "当前项目进度")
    @ExcelIgnore
    val currentProjectProgress: String?,
    @get:Schema(description = "入库时间")
    @ExcelProperty("入库时间")
    val entryTime: LocalDateTime?,
    @get:Schema(description = "注册信息统计日期")
    @ExcelProperty("注册信息统计日期")
    val registrationInfoStatisticsDate: LocalDate?,
    @get:Schema(description = "佐证资料（营业执照）")
    @ExcelProperty("佐证资料（营业执照）")
    val certificateDataBusinessLicense: String?,
    @get:Schema(description = "备案（核准）项目名称")
    @ExcelProperty("备案（核准）项目名称")
    val filingApprovalProjectName: String?,
    @get:Schema(description = "备案（核准）投资总额（亿元）")
    @ExcelProperty("备案（核准）投资总额（亿元）")
    val filingApprovalInvestmentTotal: Double?,
    @get:Schema(description = "备案（核准）日期")
    @ExcelProperty("备案（核准）日期")
    val filingApprovalDate: LocalDate?,
    @get:Schema(description = "备案信息统计日期")
    @ExcelProperty("备案信息统计日期")
    val filingInfoStatisticsDate: LocalDate?,
    @get:Schema(description = "佐证资料（项目备案（核准）文件）")
    @ExcelProperty("佐证资料（项目备案（核准）文件）")
    val certificateDataProjectFilingApprovalFile: String?,
    @get:Schema(description = "是否涉及固定资产投资项目")
    @ExcelIgnore
    val isFixedAssetInvestment: Boolean?,
    @get:Schema(description = "是否涉及建设用地")
    @ExcelIgnore
    val isConstructionLand: Boolean?,
    @get:Schema(description = "建设用地规划许可证编号")
    @ExcelProperty("建设用地规划许可证编号")
    val constructionLandPlanningPermitNumber: String?,
    @get:Schema(description = "取得许可证日期")
    @ExcelProperty("取得许可证日期")
    val permitObtainDate: LocalDate?,
    @get:Schema(description = "完成报批统计日期")
    @ExcelProperty("完成报批统计日期")
    val completionReportStatisticsDate: LocalDate?,
    @get:Schema(description = "佐证资料")
    @ExcelProperty("佐证资料")
    val certificateData: String?,
    @get:Schema(description = "开工确认日期")
    @ExcelProperty("开工确认日期")
    val startConfirmDate: LocalDate?,
    @get:Schema(description = "竣工确认日期")
    @ExcelProperty("竣工确认日期")
    val endConfirmDate: LocalDate?,
    @get:Schema(description = "是否为新引进企业")
    @ExcelIgnore
    val isNewIntroducedEnterprise: Boolean?,
    @get:Schema(description = "项目评级（内资、外资；金额分级）")
    @ExcelProperty("项目评级（内资、外资；金额分级）")
    val projectRating: String?,
    @get:Schema(description = "主要投资方名称")
    @ExcelProperty("主要投资方名称")
    val mainInvestorName: String?,
    @get:Schema(description = "计划总投资（亿元）")
    @ExcelProperty("计划总投资（亿元）")
    val plannedTotalInvestment: String?,
    @get:Schema(description = "项目选址位置")
    @ExcelProperty("项目选址位置")
    val projectLocation: String?,
    @get:Schema(description = "是否为招商会项目")
    @ExcelIgnore
    val isRecruitmentFairProject: Boolean?,
    @get:Schema(description = "招商会名称")
    @ExcelProperty("招商会名称")
    val recruitmentFairName: String?,
    @get:Schema(description = "签约时间")
    @ExcelProperty("签约时间")
    val signingTime: LocalDate?,
    @get:Schema(description = "签约合同")
    @ExcelProperty("签约合同")
    val signingContract: String?,
    @get:Schema(description = "项目总投资额（亿美元）")
    @ExcelProperty("项目总投资额（亿美元）")
    val totalInvestmentUsd: Double?,
    @get:Schema(description = "项目总投资额（亿元）")
    @ExcelProperty("项目总投资额（亿元）")
    val totalInvestmentCny: Double?,
    @get:Schema(description = "项目来源")
    @ExcelProperty("项目来源")
    val projectSource: String?,
    @get:Schema(description = "厂房类型")
    @ExcelProperty("厂房类型")
    val factoryType: String?,
    @get:Schema(description = "拟用地面积（平方米）")
    @ExcelProperty("拟用地面积（平方米）")
    val plannedLandArea: Float?,
    @get:Schema(description = "拟租厂房面积（平方米）")
    @ExcelProperty("拟租厂房面积（平方米）")
    val plannedRentalFactoryArea: Float?,
    @get:Schema(description = "拟购厂房面积（平方米）")
    @ExcelProperty("拟购厂房面积（平方米）")
    val plannedPurchaseFactoryArea: Float?,
    @get:Schema(description = "预计年销量（万元）")
    @ExcelProperty("预计年销量（万元）")
    val expectedAnnualSales: Float?,
    @get:Schema(description = "预计年销售（万元）")
    @ExcelProperty("预计年销售（万元）")
    val expectedAnnualSalesAmount: Float?,
    @get:Schema(description = "预计年税收（万元）")
    @ExcelProperty("预计年税收（万元）")
    val expectedAnnualTax: Float?,
    @get:Schema(description = "项目类型")
    @ExcelProperty("项目类型")
    val projectType: String?,
    @get:Schema(description = "产业大类名称")
    @ExcelProperty("产业大类名称")
    val industryMajorClassName: String?,
    @get:Schema(description = "所属行业")
    @ExcelProperty("所属行业")
    val belongingIndustry: String?,
    @get:Schema(description = "投资方性质")
    @ExcelProperty("投资方性质")
    val investorNature: String?,
    @get:Schema(description = "项目简介")
    @ExcelProperty("项目简介")
    val projectProfile: String?,
    @get:Schema(description = "是否为世界500强或全球专业领域行业龙头企业")
    @ExcelIgnore
    val isWorldTop500OrLeadingGlobalCompany: Boolean?,
    @get:Schema(description = "是否为国内500强或国内行业排名前100企业")
    @ExcelIgnore
    val isDomesticTop500OrTop100Company: Boolean?,
    @get:Schema(description = "是否为上市公司或上市辅导期企业")
    @ExcelIgnore
    val isPubliclyTradedOrPreIPOCompany: Boolean?,
    @get:Schema(description = "是否为瞪羚、专精特新、独角兽企业")
    @ExcelIgnore
    val isUnicornStartup: Boolean?,
    @get:Schema(description = "已投资项目对属地政府亩均税收（万元）")
    @ExcelProperty("已投资项目对属地政府亩均税收（万元）")
    val averageTaxPerMuOfExistingInvestment: Float?,
    @get:Schema(description = "主要客户")
    @ExcelProperty("主要客户")
    val majorCustomers: String?,
    @get:Schema(description = "固定资产投资（万元）")
    @ExcelProperty("固定资产投资（万元）")
    val fixedAssetInvestment: Float?,
    @get:Schema(description = "设备投资（万元）")
    @ExcelProperty("设备投资（万元）")
    val equipmentInvestment: Float?,
    @get:Schema(description = "计划开工时间")
    @ExcelProperty("计划开工时间")
    val plannedStartTime: LocalDate?,
    @get:Schema(description = "计划竣工时间")
    @ExcelProperty("计划竣工时间")
    val plannedEndTime: LocalDate?,
    @get:Schema(description = "项目使用主要原、辅材料")
    @ExcelProperty("项目使用主要原、辅材料")
    val mainRawMaterialsUsed: String?,
    @get:Schema(description = "主要流程工艺")
    @ExcelProperty("主要流程工艺")
    val mainProcessTechnology: String?,
    @get:Schema(description = "是否为新供地项目")
    @ExcelProperty("是否为新供地项目")
    val isNewSupplyLandProject: Boolean?,
    @get:Schema(description = "申请用地面积（亩）")
    @ExcelProperty("申请用地面积（亩）")
    val appliedLandArea: Float?,
    @get:Schema(description = "行业是否属于高新技术产业分类目录")
    @ExcelIgnore
    val isHighTechIndustry: Boolean?,
    @get:Schema(description = "是否为高技术项目")
    @ExcelIgnore
    val isHighTechProject: Boolean?,
    @get:Schema(description = "是否为国家工业战略性新兴产业")
    @ExcelIgnore
    val isNationalStrategicEmergingIndustry: Boolean?,
    @get:Schema(description = "容积率（%）")
    @ExcelProperty("容积率（%）")
    val plotRatioPercent: Float?,
    @get:Schema(description = "预期开票销售（万元）")
    @ExcelProperty("预期开票销售（万元）")
    val expectedInvoiceSales: Float?,
    @get:Schema(description = "预期税收（万元）")
    @ExcelProperty("预期税收（万元）")
    val expectedTax: Float?,
    @get:Schema(description = "预期用工人数（人）")
    @ExcelProperty("预期用工人数（人）")
    val expectedEmployeeCount: Int?,
    @get:Schema(description = "固定资产投资占比（%）")
    @ExcelProperty("固定资产投资占比（%）")
    val fixedAssetInvestmentPercentage: Float?,
    @get:Schema(description = "投资强度（万元/千平方米）")
    @ExcelProperty("投资强度（万元/千平方米）")
    val investmentIntensity: String?,
    @get:Schema(description = "预期亩均税收（万元/千平方米）")
    @ExcelProperty("预期亩均税收（万元/千平方米）")
    val expectedAverageTax: Float?,
    @get:Schema(description = "是否有产生废水和挥发性有机废水排放")
    @ExcelIgnore
    val wastewaterBy1: String?,
    @get:Schema(description = "产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂")
    @ExcelIgnore
    val wastewaterBy2: Boolean?,
    @get:Schema(description = "总能耗")
    @ExcelProperty("总能耗")
    val totalEnergyConsumption: String?,
    @get:Schema(description = "项目是否含有研发团队、产学研合作及研发机构建设内容")
    @ExcelIgnore
    val hasRndTeamAndCooperation: Boolean?,
    @get:Schema(description = "项目是否拥有相关有效发明专利")
    @ExcelIgnore
    val hasValidPatents: Boolean?,
    @get:Schema(description = "是否拟列入重点活动签约项目库")
    @ExcelIgnore
    val isListedAsKeyActivitySigningProject: Boolean?,
    @get:Schema(description = "备注")
    @ExcelProperty("备注")
    val remarks: String?,
    @get:Schema(description = "协议利用外资（万美元）")
    @ExcelProperty("协议利用外资（万美元）")
    val agreementForeignDirectInvestment: Float?,
    @get:Schema(description = "招商项目ID")
    @ExcelProperty("招商项目ID")
    val investOnlineId: String?,
    @get:Schema(description = "在线审批ID")
    @ExcelProperty("在线审批ID")
    var onlineApprovalIds: List<String>? = null,
    @get:Schema(description = "工改ID")
    @ExcelProperty("工改ID")
    var constructionApprovalIds: List<String>? = null,
    @get:Schema(description = "是否需要质量评估")
    @ExcelProperty("是否需要质量评估")
    val isQualityEvaluation: Boolean?,
    @get:Schema(description = "是否需要项目审核")
    @ExcelProperty("是否需要项目审核")
    val isProjectReview: Boolean?,
    @get:Schema(description = "质态评估是否完成")
    @ExcelIgnore
    val isQualityEvaluationComplete: Boolean?,
    @get:Schema(description = "项目审核是否完成")
    @ExcelIgnore
    val isProjectReviewComplete: Boolean?,
    @get:Schema(description = "是否项目竣工审批")
    @ExcelIgnore
    val isProjectCompletionApproval: Boolean?,
    @get:Schema(description = "是否项目开工审批")
    @ExcelIgnore
    val isProjectStartApproval: Boolean?,
    @get:Schema(description = "0&#61;待审核 1&#61;市级审核通过 2&#61;市区审核通过 3&#61;审核不通过 4&#61;保存未提交")
    @ExcelProperty("0&#61;待审核 1&#61;市级审核通过 2&#61;市区审核通过 3&#61;审核不通过 4&#61;保存未提交")
    val checkStatus: Short?,
    @get:Schema(description = "建筑类型")
    @ExcelProperty("建筑类型")
    val buildingType: String?,
    @get:Schema(description = "使用面积")
    @ExcelProperty("使用面积")
    val useArea: String?,
    @get:Schema(description = "租赁面积")
    @ExcelProperty("租赁面积")
    val rentArea: String?,
    @get:Schema(description = "购买面积")
    @ExcelProperty("购买面积")
    val buyArea: String?,
    @get:Schema(description = "年度销量")
    @ExcelProperty("年度销量")
    val yearXl: String?,
    @get:Schema(description = "年度税收")
    @ExcelProperty("年度税收")
    val yearSs: String?,
    @get:Schema(description = "评估状态")
    @ExcelProperty("评估状态")
    val pgStatus: String?,
    @get:Schema(description = "是否科创项目")
    @ExcelProperty("是否科创项目")
    val isKcProj: String?,
    @get:Schema(description = "科创项目条件")
    @ExcelProperty("科创项目条件")
    val kcProjTj: String?,
    @get:Schema(description = "是否QFLP外资项目")
    @ExcelProperty("是否QFLP外资项目")
    val isQflp: String?,
    @get:Schema(description = "成效说明")
    @ExcelProperty("成效说明")
    val cgRemark: String?,
    @get:Schema(description = "是否特殊行业")
    @ExcelProperty("是否特殊行业")
    val tshy: String?,
    @get:Schema(description = "准入限制")
    @ExcelProperty("准入限制")
    val zrxz: String?,
    @get:Schema(description = "是否两高项目")
    @ExcelProperty("是否两高项目")
    val lgxm: String?,
    @get:Schema(description = "是否有重金属排放")
    @ExcelProperty("是否有重金属排放")
    val zjspf: String?,
    @get:Schema(description = "产品市场现状")
    @ExcelProperty("产品市场现状")
    val cpscxz: String?,
    @get:Schema(description = "工艺水平")
    @ExcelProperty("工艺水平")
    val gysp: String?,
    @get:Schema(description = "生产效率")
    @ExcelProperty("生产效率")
    val scxl: String?,
    @get:Schema(description = "良品率")
    @ExcelProperty("良品率")
    val lpl: String?,
    @get:Schema(description = "是否高新技术企业")
    @ExcelProperty("是否高新技术企业")
    val ifGxjs: String?,
    @get:Schema(description = "是否建立研发中心")
    @ExcelProperty("是否建立研发中心")
    val ifBuildYfzx: String?,
    @get:Schema(description = "研发中心名称")
    @ExcelProperty("研发中心名称")
    val buildYfzx: String?,
    @get:Schema(description = "审核状态")
    @ExcelIgnore
    var auditStatus: String?,
    @get:Schema(description = "亮灯")
    @ExcelProperty("亮灯")
    var light: String?,
    @get:Schema(description = "项目来源")
    @ExcelProperty("项目来源")
    var source: String?,
    @get:Schema(description = "市级机关名称")
    @ExcelProperty("市级机关名称")
    var sourceDepartmentName: String?,
    @get:Schema(description = "项目动态")
    @ExcelProperty("项目动态")
    var projectDynamics: String?,
    @get:Schema(description = "预期产值")
    var yqCz: String?,
    @get:Schema(description = "预期开票销售（万元）")
    var yqKpxs: String?,
    @get:Schema(description = "预期税收（万元）")
    var yqSs: String?,
    @get:Schema(description = "预期亩均税收（万元/亩）")
    var yqMjtax: String?,
    @get:Schema(description = "产业关联度")
    var cyGl: String?,

    @get:Schema(description = "实际签约时间")
    val actualSigningTime: LocalDate?,
    @get:Schema(description = "是否融资需求")
    val isRzxq: String?,
    @get:Schema(description = "融资金额")
    val rzMoney: String?,
    @get:Schema(description = "初次接洽时间")
    val firstTime: String?,
    @get:Schema(description = "租赁厂房面积")
    val zlLandArea: String?,
    @get:Schema(description = "折算用地")
    val zlLandAreaZs: String?,
    @get:Schema(description = "项目得分")
    @get:JsonDecimal(4)
    var projectScore: Float?,
    @get:Schema(description = "开工申请时间")
    var startApplyTime: LocalDate?,
    @get:Schema(description = "签约申请时间")
    var signingApplyTime: LocalDate?,
    @get:Schema(description = "竣工申请时间")
    var completionApplyTime: LocalDate?,
    @get:Schema(description = "是否已填报")
    var isFilled: Boolean?,
    @get:Schema(description = "项目是否列统 ")
    @ExcelProperty("项目是否列统 ")
    val isLt: Boolean?,
    @get:Schema(description = "统计编码")
    @ExcelProperty("统计编码")
    val ltCode: String?,
    @get:Schema(description = "投资方注册地")
    val investorPlace: String? = null,
    @get:Schema(description = "城市名称")
    val cityName: String? = null,
    @get:Schema(description = "是否有市外资金投入")
    val ifOutCity: Boolean? = null,
    @get:Schema(description = "股权比例")
    val shareRatio: String? = null,
    @get:Schema(description = "已供面积")
    var suppliedArea: String? = null,
    @get:Schema(description = "盘活面积")
    var panHuoArea: String? = null,
    @get:Schema(description = "年度投资额(万元)")
    var tzgm: Float? = null,

    @get:Schema(description = "是否增资扩产")
    val isZzkc: Boolean?,
    @get:Schema(description = "项目属性列表")
    @ExcelProperty("项目属性列表")
    var projectAttributeList: MutableList<String> = mutableListOf()
) {

    @get:Schema(description = "签约核定阶段")
    @ExcelProperty("签约核定阶段")
    @get:JsonLabel("review_progress")
    var auditStatusqyLabel: String? = null
        get() = auditStatusqy.toString()
        private set

    @get:Schema(description = "签约核定阶段")
    @ExcelProperty("签约核定阶段")
    @get:JsonLabel("review_progress")
    var auditStatusKaigongLabel: String? = null
        get() = auditStatusKaigong.toString()
        private set

    @get:Schema(description = "投资标识")
    @ExcelProperty("投资标识")
    @get:JsonLabel("domestic_foreign_investment")
    var investmentFlagLabel: String? = null
        get() = investmentFlag
        private set

    @get:Schema(description = "当前项目进度")
    @ExcelProperty("当前项目进度")
    @get:JsonLabel("project_progress")
    var currentProjectProgressLabel: String? = null
        get() = currentProjectProgress
        private set

    @get:Schema(description = "是否涉及固定资产投资项目")
    @ExcelProperty("是否涉及固定资产投资项目")
    @get:JsonLabel("boolean")
    var isFixedAssetInvestmentLabel: String? = null
        get() = isFixedAssetInvestment?.toString()
        private set

    @get:Schema(description = "是否涉及建设用地")
    @ExcelProperty("是否涉及建设用地")
    @get:JsonLabel("boolean")
    var isConstructionLandLabel: String? = null
        get() = isConstructionLand?.toString()
        private set

    @get:Schema(description = "是否为新引进企业")
    @ExcelProperty("是否为新引进企业")
    @get:JsonLabel("boolean")
    var isNewIntroducedEnterpriseLabel: String? = null
        get() = isNewIntroducedEnterprise?.toString()
        private set

    @get:Schema(description = "是否为招商会项目")
    @ExcelProperty("是否为招商会项目")
    @get:JsonLabel("boolean")
    var isRecruitmentFairProjectLabel: String? = null
        get() = isRecruitmentFairProject?.toString()
        private set

    @get:Schema(description = "是否为世界500强或全球专业领域行业龙头企业")
    @ExcelProperty("是否为世界500强或全球专业领域行业龙头企业")
    @get:JsonLabel("boolean")
    var isWorldTop500OrLeadingGlobalCompanyLabel: String? = null
        get() = isWorldTop500OrLeadingGlobalCompany?.toString()
        private set

    @get:Schema(description = "是否为国内500强或国内行业排名前100企业")
    @ExcelProperty("是否为国内500强或国内行业排名前100企业")
    @get:JsonLabel("boolean")
    var isDomesticTop500OrTop100CompanyLabel: String? = null
        get() = isDomesticTop500OrTop100Company?.toString()
        private set

    @get:Schema(description = "是否为上市公司或上市辅导期企业")
    @ExcelProperty("是否为上市公司或上市辅导期企业")
    @get:JsonLabel("boolean")
    var isPubliclyTradedOrPreIPOCompanyLabel: String? = null
        get() = isPubliclyTradedOrPreIPOCompany?.toString()
        private set

    @get:Schema(description = "是否为瞪羚、专精特新、独角兽企业")
    @ExcelProperty("是否为瞪羚、专精特新、独角兽企业")
    @get:JsonLabel("boolean")
    var isUnicornStartupLabel: String? = null
        get() = isUnicornStartup?.toString()
        private set

    @get:Schema(description = "行业是否属于高新技术产业分类目录")
    @ExcelProperty("行业是否属于高新技术产业分类目录")
    @get:JsonLabel("boolean")
    var isHighTechIndustryLabel: String? = null
        get() = isHighTechIndustry?.toString()
        private set

    @get:Schema(description = "是否为高技术项目")
    @ExcelProperty("是否为高技术项目")
    @get:JsonLabel("boolean")
    var isHighTechProjectLabel: String? = null
        get() = isHighTechProject?.toString()
        private set

    @get:Schema(description = "是否为国家工业战略性新兴产业")
    @ExcelProperty("是否为国家工业战略性新兴产业")
    @get:JsonLabel("boolean")
    var isNationalStrategicEmergingIndustryLabel: String? = null
        get() = isNationalStrategicEmergingIndustry?.toString()
        private set

    @get:Schema(description = "是否有产生废水和挥发性有机废水排放")
    @ExcelProperty("是否有产生废水和挥发性有机废水排放")
    @get:JsonLabel("boolean")
    var wastewaterBy1Label: String? = null
        get() = wastewaterBy1
        private set

    @get:Schema(description = "产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂")
    @ExcelProperty("产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂")
    @get:JsonLabel("boolean")
    var wastewaterBy2Label: String? = null
        get() = wastewaterBy2?.toString()
        private set

    @get:Schema(description = "项目是否含有研发团队、产学研合作及研发机构建设内容")
    @ExcelProperty("项目是否含有研发团队、产学研合作及研发机构建设内容")
    @get:JsonLabel("boolean")
    var hasRndTeamAndCooperationLabel: String? = null
        get() = hasRndTeamAndCooperation?.toString()
        private set

    @get:Schema(description = "项目是否拥有相关有效发明专利")
    @ExcelProperty("项目是否拥有相关有效发明专利")
    @get:JsonLabel("boolean")
    var hasValidPatentsLabel: String? = null
        get() = hasValidPatents?.toString()
        private set

    @get:Schema(description = "是否拟列入重点活动签约项目库")
    @ExcelProperty("是否拟列入重点活动签约项目库")
    @get:JsonLabel("boolean")
    var isListedAsKeyActivitySigningProjectLabel: String? = null
        get() = isListedAsKeyActivitySigningProject?.toString()
        private set

    @get:Schema(description = "是否质态评估市级机关预警")
    @ExcelProperty("是否质态评估市级机关预警")
    @get:JsonLabel("boolean")
    var isQualityEvaluationLabel: String? = null
        get() = isQualityEvaluation?.toString()
        private set


    @get:Schema(description = "是否项目审核")
    @ExcelProperty("是否为项目审核")
    @get:JsonLabel("boolean")
    var isProjectReviewLabel: String? = null
        get() = isProjectReview?.toString()
        private set

    constructor(record: ProjectDigitalInvestmentAttracting) : this(
        record,
        record.district,
        record.park,
    )

    constructor(record: ProjectDigitalInvestmentAttracting, districtName: String?, parkName: String?) : this(
        id = record.id,
        projectCode = record.projectCode,
        projectName = record.projectName,
        district = record.district,
        districtName = districtName,
        park = record.park,
        parkName = parkName,
        nationalEconomicClassification = record.nationalEconomicClassification,
        uscc = record.uscc,
        companyName = record.companyName,
        companyRegistrationFunds = record.companyRegistrationFunds,
        companyRegistrationDate = record.companyRegistrationDate,
        projectCategory = record.projectCategory,
        projectAttribute = record.projectAttribute,
        projectContent = record.projectContent,
        investmentFlag = record.investmentFlag,
        countryRegion = record.countryRegion,
        specificCountryRegion = record.specificCountryRegion,
        investor = record.investor,
        investmentAmount = record.investmentAmount,
        registeredCapital = record.registeredCapital,
        negotiationProgress = record.negotiationProgress,
        industryClassification = record.industryClassification,
        currentProjectProgress = record.currentProjectProgress?.value,
        entryTime = record.entryTime,
        registrationInfoStatisticsDate = record.registrationInfoStatisticsDate,
        certificateDataBusinessLicense = record.certificateDataBusinessLicense,
        filingApprovalProjectName = record.filingApprovalProjectName,
        filingApprovalInvestmentTotal = record.filingApprovalInvestmentTotal,
        filingApprovalDate = record.filingApprovalDate,
        filingInfoStatisticsDate = record.filingInfoStatisticsDate,
        certificateDataProjectFilingApprovalFile = record.certificateDataProjectFilingApprovalFile,
        isFixedAssetInvestment = record.yesFixedAssetInvestment,
        isConstructionLand = record.isConstructionLand,
        constructionLandPlanningPermitNumber = record.constructionLandPlanningPermitNumber,
        permitObtainDate = record.permitObtainDate,
        completionReportStatisticsDate = record.completionReportStatisticsDate,
        certificateData = record.certificateData,
        startConfirmDate = record.startConfirmDate,
        endConfirmDate = record.endConfirmDate,
        isNewIntroducedEnterprise = record.isNewIntroducedEnterprise,
        projectRating = record.projectRating,
        mainInvestorName = record.mainInvestorName,
        plannedTotalInvestment = record.plannedTotalInvestment,
        projectLocation = record.projectLocation,
        isRecruitmentFairProject = record.isRecruitmentFairProject,
        recruitmentFairName = record.recruitmentFairName,
        signingTime = record.signingTime,
        actualSigningTime = record.actualSigningTime,
        signingContract = record.signingContract,
        totalInvestmentUsd = record.totalInvestmentUsd,
        totalInvestmentCny = record.totalInvestmentCny,
        projectSource = record.projectSource,
        factoryType = record.factoryType,
        plannedLandArea = record.plannedLandArea,
        plannedRentalFactoryArea = record.plannedRentalFactoryArea,
        plannedPurchaseFactoryArea = record.plannedPurchaseFactoryArea,
        expectedAnnualSales = record.expectedAnnualSales,
        expectedAnnualSalesAmount = record.expectedAnnualSalesAmount,
        expectedAnnualTax = record.expectedAnnualTax,
        projectType = record.projectType,
        industryMajorClassName = record.industryMajorClassName,
        belongingIndustry = record.belongingIndustry,
        investorNature = record.investorNature,
        projectProfile = record.projectProfile,
        isWorldTop500OrLeadingGlobalCompany = record.isWorldTop500OrLeadingGlobalCompany,
        isDomesticTop500OrTop100Company = record.isDomesticTop500OrTop100Company,
        isPubliclyTradedOrPreIPOCompany = record.isPubliclyTradedOrPreIPOCompany,
        isUnicornStartup = record.isUnicornStartup,
        averageTaxPerMuOfExistingInvestment = record.averageTaxPerMuOfExistingInvestment,
        majorCustomers = record.majorCustomers,
        fixedAssetInvestment = record.fixedAssetInvestment,
        equipmentInvestment = record.equipmentInvestment,
        plannedStartTime = record.plannedStartTime,
        plannedEndTime = record.plannedEndTime,
        mainRawMaterialsUsed = record.mainRawMaterialsUsed,
        mainProcessTechnology = record.mainProcessTechnology,
        isNewSupplyLandProject = record.isNewSupplyLandProject,
        appliedLandArea = record.appliedLandArea,
        isHighTechIndustry = record.isHighTechIndustry,
        isHighTechProject = record.isHighTechProject,
        isNationalStrategicEmergingIndustry = record.isNationalStrategicEmergingIndustry,
        plotRatioPercent = record.plotRatioPercent,
        expectedInvoiceSales = record.expectedInvoiceSales,
        expectedTax = record.expectedTax,
        expectedEmployeeCount = record.expectedEmployeeCount,
        fixedAssetInvestmentPercentage = record.fixedAssetInvestmentPercentage,
        investmentIntensity = if (record.investmentIntensity == "Infinity") null else record.investmentIntensity,
        expectedAverageTax = record.expectedAverageTax,
        wastewaterBy1 = record.wastewaterBy1,
        wastewaterBy2 = record.wastewaterBy2,
        totalEnergyConsumption = record.totalEnergyConsumption,
        hasRndTeamAndCooperation = record.hasRndTeamAndCooperation,
        hasValidPatents = record.hasValidPatents,
        isListedAsKeyActivitySigningProject = record.isListedAsKeyActivitySigningProject,
        remarks = record.remarks,
        agreementForeignDirectInvestment = record.agreementForeignDirectInvestment,
        investOnlineId = record.investOnlineId,
        isQualityEvaluation = record.isQualityEvaluation,
        isProjectReview = record.isProjectReview,
        isQualityEvaluationComplete = record.isQualityEvaluationComplete,
        isProjectReviewComplete = record.isProjectReviewComplete,
        isProjectStartApproval = record.isStartApproval,
        isProjectCompletionApproval = record.isCompletionApproval,
        checkStatus = record.checkStatus,
        buildingType = record.buildingType,
        useArea = record.useArea,
        rentArea = record.rentArea,
        buyArea = record.buyArea,
        yearXl = record.yearXl,
        yearSs = record.yearSs,
        pgStatus = record.pgStatus,
        isKcProj = record.isKcProj,
        kcProjTj = record.kcProjTj,
        isQflp = record.isQflp,
        cgRemark = record.cgRemark,
        tshy = record.tshy,
        zrxz = record.zrxz,
        lgxm = record.lgxm,
        zjspf = record.zjspf,
        cpscxz = record.cpscxz,
        gysp = record.gysp,
        scxl = record.scxl,
        lpl = record.lpl,
        ifGxjs = record.ifGxjs,
        ifBuildYfzx = record.ifBuildYfzx,
        buildYfzx = record.buildYfzx,
        auditStatus = null,
        light = null,
        source = record.source,
        sourceDepartmentName = record.sjjgName,
        projectDynamics = null,
        yqCz = record.yqCz,
        yqKpxs = record.yqKpxs,
        yqSs = record.yqSs,
        yqMjtax = record.yqMjtax,
        cyGl = record.cyGl,
        isRzxq = record.isRzxq,
        rzMoney = record.rzMoney,
        firstTime = record.firstTime,
        zlLandArea = record.zlLandArea,
        zlLandAreaZs = record.zlLandAreaZs,
        auditStatusqy = record.auditStatus,
        auditStatusKaigong = record.auditStatusKaigong,
        projectScore = null,
        startApplyTime = null,
        signingApplyTime = null,
        completionApplyTime = null,
        isFilled = null,
        isLt = record.isLt,
        ltCode = record.ltCode,
        investorPlace = record.investorPlace,
        cityName = record.cityName,
        ifOutCity = record.ifOutCity,
        shareRatio = record.shareRatio,
        suppliedArea = record.ygmj,
        panHuoArea = record.phmj,
        tzgm = record.tzgm,
        isZzkc = record.isZzkc,
        projectAttributeList = mutableListOf()
    )
}
